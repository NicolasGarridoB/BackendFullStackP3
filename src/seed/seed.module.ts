import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { User } from '../users/entities/user.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Boleta } from '../boletas/entities/boleta.entity';
import { BoletaDetalle } from '../boletas/entities/boleta-detalle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Producto,
      Categoria,
      Boleta,
      BoletaDetalle,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
