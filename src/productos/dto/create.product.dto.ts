import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  MinLength,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({
    description: 'Nombre de la carta Pokemon',
    example: 'Charizard VMAX',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  nombre: string;

  @ApiProperty({
    description: 'Descripción detallada de la carta',
    example: 'Carta holográfica de Charizard en su forma VMAX con 330 HP',
    required: false,
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({
    description: 'Precio de la carta en pesos chilenos',
    example: 15000,
  })
  @IsNumber()
  @IsPositive()
  precio: number;

  @ApiProperty({
    description: 'Cantidad disponible en stock',
    example: 10,
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'URL de la imagen de la carta',
    example: 'https://ejemplo.com/imagenes/charizard-vmax.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  imagen?: string;

  @ApiProperty({
    description: 'Rareza de la carta',
    example: 'Ultra Rare',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  rareza?: string;

  @ApiProperty({
    description: 'Set o colección a la que pertenece la carta',
    example: 'Vivid Voltage',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  setPokemon?: string;

  @ApiProperty({
    description: 'ID de la categoría de la carta',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  categoriaId: number;
}
