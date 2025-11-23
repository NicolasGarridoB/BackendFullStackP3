import { PartialType } from '@nestjs/swagger';
import { CreateProductoDto } from './create.product.dto';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {}
