import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Boleta } from './boleta.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('boleta_detalles')
export class BoletaDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'boleta_id' })
  boletaId: number;

  @ManyToOne(() => Boleta, (boleta) => boleta.detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'boleta_id' })
  boleta: Boleta;

  @Column({ type: 'int', name: 'producto_id' })
  productoId: number;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_unitario' })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
