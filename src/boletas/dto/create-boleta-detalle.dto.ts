import {
  IsInt,
  IsPositive,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoletaDetalleDto {
  @ApiProperty({
    description: 'ID del producto',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  productoId: number;

  @ApiProperty({
    description: 'Cantidad a comprar',
    example: 2,
  })
  @IsInt()
  @Min(1)
  cantidad: number;
}
