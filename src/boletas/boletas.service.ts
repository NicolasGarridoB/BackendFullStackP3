import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateBoletaDto } from './dto/create-boleta.dto';
import { UpdateBoletaDto } from './dto/update-boleta.dto';
import { Boleta, EstadoBoleta } from './entities/boleta.entity';
import { BoletaDetalle } from './entities/boleta-detalle.entity';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class BoletasService {
  constructor(
    @InjectRepository(Boleta)
    private readonly boletaRepository: Repository<Boleta>,
    @InjectRepository(BoletaDetalle)
    private readonly boletaDetalleRepository: Repository<BoletaDetalle>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Genera un número de boleta único
   * Formato: BOL-YYYY-NNNN
   */
  private async generarNumeroBoleta(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `BOL-${year}-`;

    // Buscar la última boleta del año
    const ultimaBoleta = await this.boletaRepository
      .createQueryBuilder('boleta')
      .where('boleta.numero LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('boleta.numero', 'DESC')
      .getOne();

    let numero = 1;
    if (ultimaBoleta) {
      const ultimoNumero = parseInt(ultimaBoleta.numero.split('-')[2]);
      numero = ultimoNumero + 1;
    }

    return `${prefix}${numero.toString().padStart(4, '0')}`;
  }

  /**
   * Calcula el IVA (19%)
   */
  private calcularIVA(subtotal: number): number {
    return Math.round(subtotal * 0.19 * 100) / 100;
  }

  /**
   * Crea una nueva boleta con sus detalles
   * - Valida stock de productos
   * - Calcula totales automáticamente
   * - Actualiza stock de productos
   * - Ejecuta todo en una transacción
   */
  async create(
    createBoletaDto: CreateBoletaDto,
    usuarioId?: number,
  ): Promise<Boleta> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Usar usuarioId del parámetro o del DTO
      const idUsuario = usuarioId || createBoletaDto.usuarioId;
      if (!idUsuario) {
        throw new BadRequestException('Se requiere el ID del usuario');
      }

      // Validar que existan los productos y haya stock suficiente
      const detallesConProductos: Array<{
        producto: Producto;
        cantidad: number;
      }> = [];

      for (const detalle of createBoletaDto.detalles) {
        const producto = await this.productoRepository.findOne({
          where: { id: detalle.productoId },
        });

        if (!producto) {
          throw new NotFoundException(
            `Producto con ID ${detalle.productoId} no encontrado`,
          );
        }

        if (producto.stock < detalle.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}, Solicitado: ${detalle.cantidad}`,
          );
        }

        detallesConProductos.push({
          producto,
          cantidad: detalle.cantidad,
        });
      }

      // Calcular subtotal
      let subtotal = 0;
      for (const item of detallesConProductos) {
        subtotal += item.producto.precio * item.cantidad;
      }

      // Calcular IVA y total
      const iva = this.calcularIVA(subtotal);
      const total = subtotal + iva;

      // Generar número de boleta
      const numero = await this.generarNumeroBoleta();

      // Crear boleta
      const boleta = this.boletaRepository.create({
        numero,
        fecha: new Date(),
        usuarioId: idUsuario,
        subtotal,
        iva,
        total,
        estado: EstadoBoleta.PENDIENTE,
      });

      const boletaGuardada = await queryRunner.manager.save(boleta);

      // Crear detalles y actualizar stock
      const detalles: BoletaDetalle[] = [];
      for (const item of detallesConProductos) {
        const detalle = this.boletaDetalleRepository.create({
          boletaId: boletaGuardada.id,
          productoId: item.producto.id,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precio,
          subtotal: item.producto.precio * item.cantidad,
        });

        const detalleGuardado = await queryRunner.manager.save(detalle);
        detalles.push(detalleGuardado);

        // Actualizar stock
        item.producto.stock -= item.cantidad;
        await queryRunner.manager.save(item.producto);
      }

      await queryRunner.commitTransaction();

      // Retornar boleta con detalles
      return await this.findOne(boletaGuardada.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Error al crear la boleta: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Boleta[]> {
    return await this.boletaRepository.find({
      relations: ['usuario', 'detalles', 'detalles.producto'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Boleta> {
    const boleta = await this.boletaRepository.findOne({
      where: { id },
      relations: ['usuario', 'detalles', 'detalles.producto'],
    });

    if (!boleta) {
      throw new NotFoundException(`Boleta con ID ${id} no encontrada`);
    }

    return boleta;
  }

  async findByUsuario(usuarioId: number): Promise<Boleta[]> {
    return await this.boletaRepository.find({
      where: { usuarioId },
      relations: ['detalles', 'detalles.producto'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByNumero(numero: string): Promise<Boleta> {
    const boleta = await this.boletaRepository.findOne({
      where: { numero },
      relations: ['usuario', 'detalles', 'detalles.producto'],
    });

    if (!boleta) {
      throw new NotFoundException(`Boleta con número ${numero} no encontrada`);
    }

    return boleta;
  }

  async update(id: number, updateBoletaDto: UpdateBoletaDto): Promise<Boleta> {
    const boleta = await this.findOne(id);

    // Solo se puede actualizar el estado
    if (updateBoletaDto.estado) {
      boleta.estado = updateBoletaDto.estado;
    }

    await this.boletaRepository.save(boleta);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const boleta = await this.findOne(id);

    // No permitir eliminar boletas pagadas
    if (boleta.estado === EstadoBoleta.PAGADA) {
      throw new BadRequestException('No se puede eliminar una boleta pagada');
    }

    await this.boletaRepository.remove(boleta);
  }

  /**
   * Obtiene estadísticas de ventas
   */
  async getEstadisticas() {
    const total = await this.boletaRepository.count();
    const pagadas = await this.boletaRepository.count({
      where: { estado: EstadoBoleta.PAGADA },
    });
    const pendientes = await this.boletaRepository.count({
      where: { estado: EstadoBoleta.PENDIENTE },
    });
    const canceladas = await this.boletaRepository.count({
      where: { estado: EstadoBoleta.CANCELADA },
    });

    const totalVentas = await this.boletaRepository
      .createQueryBuilder('boleta')
      .select('SUM(boleta.total)', 'total')
      .where('boleta.estado = :estado', { estado: EstadoBoleta.PAGADA })
      .getRawOne();

    return {
      total,
      pagadas,
      pendientes,
      canceladas,
      totalVentas: totalVentas?.total || 0,
    };
  }
}
