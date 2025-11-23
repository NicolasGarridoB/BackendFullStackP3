import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create.product.dto';
import { UpdateProductoDto } from './dto/update.product.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    try {
      const producto = this.productoRepository.create(createProductoDto);
      return await this.productoRepository.save(producto);
    } catch (error) {
      throw new BadRequestException(
        `Error al crear la carta Pokemon: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
    });
    if (!producto) {
      throw new NotFoundException(
        `Carta Pokemon con ID ${id} no encontrada`,
      );
    }
    return producto;
  }

  async findByCategoria(categoriaId: number): Promise<Producto[]> {
    return await this.productoRepository.find({
      where: { categoriaId },
      order: { nombre: 'ASC' },
    });
  }

  async findByRareza(rareza: string): Promise<Producto[]> {
    return await this.productoRepository.find({
      where: { rareza },
      order: { nombre: 'ASC' },
    });
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    const producto = await this.findOne(id);
    const productoActualizado = Object.assign(producto, updateProductoDto);
    return await this.productoRepository.save(productoActualizado);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
  }
}
