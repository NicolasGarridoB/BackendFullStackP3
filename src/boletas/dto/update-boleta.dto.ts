import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoBoleta } from '../entities/boleta.entity';

export class UpdateBoletaDto {
  @ApiProperty({
    description: 'Estado de la boleta',
    enum: EstadoBoleta,
    example: EstadoBoleta.PAGADA,
    required: false,
  })
  @IsEnum(EstadoBoleta)
  @IsOptional()
  estado?: EstadoBoleta;
}
