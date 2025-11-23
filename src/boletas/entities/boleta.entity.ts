import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BoletaDetalle } from './boleta-detalle.entity';

export enum EstadoBoleta {
  PENDIENTE = 'PENDIENTE',
  PAGADA = 'PAGADA',
  CANCELADA = 'CANCELADA',
}

@Entity('boletas')
export class Boleta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  numero: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'int', name: 'usuario_id' })
  usuarioId: number;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  iva: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: EstadoBoleta,
    default: EstadoBoleta.PENDIENTE,
  })
  estado: EstadoBoleta;

  @OneToMany(() => BoletaDetalle, (detalle) => detalle.boleta, {
    cascade: true,
    eager: true,
  })
  detalles: BoletaDetalle[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
