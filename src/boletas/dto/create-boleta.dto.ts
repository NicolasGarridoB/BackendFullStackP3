import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
  IsInt,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateBoletaDetalleDto } from './create-boleta-detalle.dto';

export class CreateBoletaDto {
  @ApiProperty({
    description: 'ID del usuario que realiza la compra (opcional, se puede tomar del token JWT)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  usuarioId?: number;

  @ApiProperty({
    description: 'Array de productos a comprar con sus cantidades',
    type: [CreateBoletaDetalleDto],
    example: [
      { productoId: 1, cantidad: 2 },
      { productoId: 3, cantidad: 1 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBoletaDetalleDto)
  @ArrayMinSize(1)
  detalles: CreateBoletaDetalleDto[];
}
