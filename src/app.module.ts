import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { ProductosModule } from './productos/productos.module';
import { BoletasModule } from './boletas/boletas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { SeedModule } from './seed/seed.module';
import { User } from './users/entities/user.entity';
import { Producto } from './productos/entities/producto.entity';
import { Boleta } from './boletas/entities/boleta.entity';
import { BoletaDetalle } from './boletas/entities/boleta-detalle.entity';
import { Categoria } from './categorias/entities/categoria.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
      entities: [User, Producto, Boleta, BoletaDetalle, Categoria],
      synchronize: true,
      charset: 'utf8mb4',
    }),
    AuthModule,
    UsersModule,
    ProductosModule,
    BoletasModule,
    CategoriasModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
