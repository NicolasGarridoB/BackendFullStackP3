import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Boleta, EstadoBoleta } from '../boletas/entities/boleta.entity';
import { BoletaDetalle } from '../boletas/entities/boleta-detalle.entity';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Boleta)
    private readonly boletaRepository: Repository<Boleta>,
    @InjectRepository(BoletaDetalle)
    private readonly boletaDetalleRepository: Repository<BoletaDetalle>,
  ) {}

  async seed() {
    console.log('🌱 Iniciando seed de datos...');
    
    await this.seedUsers();
    await this.seedCategorias();
    await this.seedProductos();
    await this.seedBoletas();
    
    return {
      message: '✅ Datos iniciales insertados correctamente',
      detalles: {
        usuarios: await this.userRepository.count(),
        categorias: await this.categoriaRepository.count(),
        productos: await this.productoRepository.count(),
        boletas: await this.boletaRepository.count(),
      },
    };
  }

  private async seedUsers() {
    // Verificar si ya existen los usuarios administradores
    const adminExists = await this.userRepository.findOne({
      where: { username: 'admin' },
    });
    const vendedorExists = await this.userRepository.findOne({
      where: { username: 'vendedor' },
    });

    const users = [];

    // Siempre crear o mantener los usuarios administradores
    if (!adminExists) {
      users.push({
        username: 'admin',
        password: await bcryptjs.hash('admin123', 10),
        nombre: 'Administrador del Sistema',
        email: 'admin@pokeshop.com',
        role: UserRole.ADMIN,
      });
    }

    if (!vendedorExists) {
      users.push({
        username: 'vendedor',
        password: await bcryptjs.hash('vendedor123', 10),
        nombre: 'Vendedor Principal',
        email: 'vendedor@pokeshop.com',
        role: UserRole.VENDEDOR,
      });
    }

    // Agregar usuarios de prueba solo si no hay ningún usuario en la BD
    const userCount = await this.userRepository.count();
    if (userCount === 0) {
      users.push(
        {
          username: 'cliente1',
          password: await bcryptjs.hash('cliente123', 10),
          nombre: 'Juan Cliente',
          email: 'cliente1@example.com',
          role: UserRole.CLIENTE,
        },
        {
          username: 'cliente2',
          password: await bcryptjs.hash('cliente123', 10),
          nombre: 'María López',
          email: 'cliente2@example.com',
          role: UserRole.CLIENTE,
        },
      );
    }

    // Insertar usuarios nuevos
    for (const userData of users) {
      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);
    }

    if (users.length > 0) {
      console.log(`✅ ${users.length} usuario(s) insertado(s) correctamente`);
    } else {
      console.log('✅ Los usuarios administradores ya existen');
    }
  }

  private async seedCategorias() {
    const categoriaCount = await this.categoriaRepository.count();
    if (categoriaCount > 0) {
      console.log('⚠️  Ya existen categorías en la base de datos');
      return;
    }

    const categorias = [
      {
        nombre: 'Cartas de Fuego',
        descripcion: 'Cartas Pokemon de tipo Fuego - Charizard, Arcanine, etc.',
      },
      {
        nombre: 'Cartas de Agua',
        descripcion: 'Cartas Pokemon de tipo Agua - Blastoise, Gyarados, etc.',
      },
      {
        nombre: 'Cartas de Planta',
        descripcion: 'Cartas Pokemon de tipo Planta - Venusaur, Vileplume, etc.',
      },
      {
        nombre: 'Cartas de Eléctrico',
        descripcion: 'Cartas Pokemon de tipo Eléctrico - Pikachu, Raichu, etc.',
      },
    ];

    for (const categoriaData of categorias) {
      const categoria = this.categoriaRepository.create(categoriaData);
      await this.categoriaRepository.save(categoria);
    }

    console.log('✅ Categorías insertadas correctamente');
  }

  private async seedProductos() {
    const productoCount = await this.productoRepository.count();
    if (productoCount > 0) {
      console.log('⚠️  Ya existen productos en la base de datos');
      return;
    }

    // Obtener categorías para asignarlas a los productos
    const categoriaFuego = await this.categoriaRepository.findOne({
      where: { nombre: 'Cartas de Fuego' },
    });
    const categoriaAgua = await this.categoriaRepository.findOne({
      where: { nombre: 'Cartas de Agua' },
    });
    const categoriaPlanta = await this.categoriaRepository.findOne({
      where: { nombre: 'Cartas de Planta' },
    });
    const categoriaElectrico = await this.categoriaRepository.findOne({
      where: { nombre: 'Cartas de Eléctrico' },
    });

    const productos = [
      {
        nombre: 'Charizard VMAX',
        descripcion:
          'Carta holográfica ultra rara de Charizard en su forma VMAX. 330 HP. Del set Darkness Ablaze.',
        precio: 45000,
        stock: 5,
        imagen: 'https://images.pokemontcg.io/swsh3/20_hires.png',
        rareza: 'Ultra Rare',
        setPokemon: 'Darkness Ablaze',
        categoriaId: categoriaFuego?.id || 1,
      },
      {
        nombre: 'Pikachu V',
        descripcion:
          'Carta especial de Pikachu V con 190 HP. Ataque Thunderbolt de 200 de daño.',
        precio: 12000,
        stock: 15,
        imagen: 'https://images.pokemontcg.io/swsh4/47_hires.png',
        rareza: 'Rare Holo V',
        setPokemon: 'Vivid Voltage',
        categoriaId: categoriaElectrico?.id || 4,
      },
      {
        nombre: 'Blastoise GX',
        descripcion:
          'Carta GX de Blastoise con 250 HP y ataque GX devastador que hace 200 de daño.',
        precio: 28000,
        stock: 8,
        imagen: 'https://images.pokemontcg.io/sm9/218_hires.png',
        rareza: 'Secret Rare',
        setPokemon: 'Team Up',
        categoriaId: categoriaAgua?.id || 2,
      },
      {
        nombre: 'Venusaur EX',
        descripcion:
          'Carta EX de Venusaur con 180 HP. Habilidad Jungle Totem que cura todos los pokémon planta.',
        precio: 18500,
        stock: 10,
        imagen: 'https://images.pokemontcg.io/xy1/1_hires.png',
        rareza: 'Rare Holo EX',
        setPokemon: 'XY Base Set',
        categoriaId: categoriaPlanta?.id || 3,
      },
      {
        nombre: 'Arcanine',
        descripcion:
          'Carta común de Arcanine con 120 HP. Ataque Fire Fang que hace 70 de daño.',
        precio: 3500,
        stock: 50,
        imagen: 'https://images.pokemontcg.io/sm8/22_hires.png',
        rareza: 'Common',
        setPokemon: 'Lost Thunder',
        categoriaId: categoriaFuego?.id || 1,
      },
      {
        nombre: 'Raichu',
        descripcion:
          'Carta poco común de Raichu con 90 HP. Ataque Thunder Shock evolutivo.',
        precio: 5500,
        stock: 30,
        imagen: 'https://images.pokemontcg.io/base1/14_hires.png',
        rareza: 'Uncommon',
        setPokemon: 'Base Set',
        categoriaId: categoriaElectrico?.id || 4,
      },
      {
        nombre: 'Gyarados',
        descripcion:
          'Carta rara de Gyarados con 130 HP. Ataque Dragon Rage que hace 80 de daño.',
        precio: 8500,
        stock: 20,
        imagen: 'https://images.pokemontcg.io/base1/6_hires.png',
        rareza: 'Rare',
        setPokemon: 'Base Set',
        categoriaId: categoriaAgua?.id || 2,
      },
      {
        nombre: 'Vileplume',
        descripcion:
          'Carta rara de Vileplume con 120 HP. Habilidad que evita el uso de items del oponente.',
        precio: 7500,
        stock: 25,
        imagen: 'https://images.pokemontcg.io/base1/15_hires.png',
        rareza: 'Rare',
        setPokemon: 'Base Set',
        categoriaId: categoriaPlanta?.id || 3,
      },
    ];

    for (const productoData of productos) {
      const producto = this.productoRepository.create(productoData);
      await this.productoRepository.save(producto);
    }

    console.log('✅ Productos (cartas Pokemon) insertados correctamente');
  }

  private async seedBoletas() {
    const boletaCount = await this.boletaRepository.count();
    if (boletaCount > 0) {
      console.log('⚠️  Ya existen boletas en la base de datos');
      return;
    }

    // Obtener usuarios y productos para crear boletas
    const cliente1 = await this.userRepository.findOne({
      where: { username: 'cliente1' },
    });
    const cliente2 = await this.userRepository.findOne({
      where: { username: 'cliente2' },
    });

    const productos = await this.productoRepository.find({ take: 4 });

    if (!cliente1 || !cliente2 || productos.length < 4) {
      console.log('⚠️  No hay suficientes datos para crear boletas');
      return;
    }

    // Boleta 1 - Cliente 1
    const subtotal1 = productos[0].precio * 2 + productos[1].precio * 1;
    const iva1 = Math.round(subtotal1 * 0.19 * 100) / 100;
    const total1 = subtotal1 + iva1;

    const boleta1 = this.boletaRepository.create({
      numero: 'BOL-2024-0001',
      fecha: new Date('2024-11-15'),
      usuarioId: cliente1.id,
      subtotal: subtotal1,
      iva: iva1,
      total: total1,
      estado: EstadoBoleta.PAGADA,
    });
    const boletaGuardada1 = await this.boletaRepository.save(boleta1);

    // Detalles boleta 1
    await this.boletaDetalleRepository.save([
      {
        boletaId: boletaGuardada1.id,
        productoId: productos[0].id,
        cantidad: 2,
        precioUnitario: productos[0].precio,
        subtotal: productos[0].precio * 2,
      },
      {
        boletaId: boletaGuardada1.id,
        productoId: productos[1].id,
        cantidad: 1,
        precioUnitario: productos[1].precio,
        subtotal: productos[1].precio * 1,
      },
    ]);

    // Boleta 2 - Cliente 2
    const subtotal2 = productos[2].precio * 1 + productos[3].precio * 3;
    const iva2 = Math.round(subtotal2 * 0.19 * 100) / 100;
    const total2 = subtotal2 + iva2;

    const boleta2 = this.boletaRepository.create({
      numero: 'BOL-2024-0002',
      fecha: new Date('2024-11-20'),
      usuarioId: cliente2.id,
      subtotal: subtotal2,
      iva: iva2,
      total: total2,
      estado: EstadoBoleta.PENDIENTE,
    });
    const boletaGuardada2 = await this.boletaRepository.save(boleta2);

    // Detalles boleta 2
    await this.boletaDetalleRepository.save([
      {
        boletaId: boletaGuardada2.id,
        productoId: productos[2].id,
        cantidad: 1,
        precioUnitario: productos[2].precio,
        subtotal: productos[2].precio * 1,
      },
      {
        boletaId: boletaGuardada2.id,
        productoId: productos[3].id,
        cantidad: 3,
        precioUnitario: productos[3].precio,
        subtotal: productos[3].precio * 3,
      },
    ]);

    console.log('✅ Boletas insertadas correctamente');
  }
}
