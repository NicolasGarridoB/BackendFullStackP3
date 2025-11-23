import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Cartas de Fuego',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  nombre: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Cartas Pokemon tipo Fuego',
    required: false,
  })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
