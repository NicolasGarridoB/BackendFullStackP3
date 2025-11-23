import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create.product.dto';
import { UpdateProductoDto } from './dto/update.product.dto';

@ApiTags('Productos - Cartas Pokemon')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nueva carta Pokemon',
    description:
      'Registra una nueva carta Pokemon en el inventario de la tienda',
  })
  @ApiResponse({
    status: 201,
    description: 'Carta Pokemon creada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas las cartas Pokemon',
    description: 'Obtiene el catálogo completo de cartas Pokemon disponibles',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de cartas obtenida exitosamente',
  })
  findAll() {
    return this.productosService.findAll();
  }

  @Get('categoria/:categoriaId')
  @ApiOperation({
    summary: 'Listar cartas por categoría',
    description: 'Obtiene todas las cartas Pokemon de una categoría específica',
  })
  @ApiParam({
    name: 'categoriaId',
    description: 'ID de la categoría',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cartas encontradas',
  })
  findByCategoria(@Param('categoriaId', ParseIntPipe) categoriaId: number) {
    return this.productosService.findByCategoria(categoriaId);
  }

  @Get('rareza/:rareza')
  @ApiOperation({
    summary: 'Listar cartas por rareza',
    description: 'Obtiene todas las cartas Pokemon de una rareza específica',
  })
  @ApiParam({
    name: 'rareza',
    description: 'Rareza de la carta',
    example: 'Ultra Rare',
  })
  @ApiResponse({
    status: 200,
    description: 'Cartas encontradas',
  })
  findByRareza(@Param('rareza') rareza: string) {
    return this.productosService.findByRareza(rareza);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener carta Pokemon por ID',
    description: 'Obtiene los detalles de una carta Pokemon específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID numérico de la carta',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Carta encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Carta no encontrada',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar carta Pokemon',
    description:
      'Actualiza los datos de una carta Pokemon existente (precio, stock, etc.)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID numérico de la carta',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Carta actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Carta no encontrada',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar carta Pokemon',
    description: 'Elimina una carta Pokemon del catálogo',
  })
  @ApiParam({
    name: 'id',
    description: 'ID numérico de la carta',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Carta eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Carta no encontrada',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}
