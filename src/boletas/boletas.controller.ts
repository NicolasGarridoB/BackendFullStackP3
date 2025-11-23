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
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BoletasService } from './boletas.service';
import { CreateBoletaDto } from './dto/create-boleta.dto';
import { UpdateBoletaDto } from './dto/update-boleta.dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('Boletas')
@Controller('boletas')
export class BoletasController {
  constructor(private readonly boletasService: BoletasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear nueva boleta',
    description:
      'Crea una nueva boleta de venta con sus detalles. Calcula automáticamente subtotal, IVA (19%) y total. Actualiza el stock de los productos. Requiere autenticación.',
  })
  @ApiResponse({
    status: 201,
    description: 'Boleta creada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o stock insuficiente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  create(@Body() createBoletaDto: CreateBoletaDto, @Request() req) {
    // Tomar el usuarioId del token JWT si no viene en el DTO
    const usuarioId = createBoletaDto.usuarioId || req.user?.sub;
    return this.boletasService.create(createBoletaDto, usuarioId);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas las boletas',
    description: 'Obtiene el listado completo de boletas con sus detalles',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de boletas obtenida exitosamente',
  })
  findAll() {
    return this.boletasService.findAll();
  }

  @Get('estadisticas')
  @ApiOperation({
    summary: 'Obtener estadísticas de ventas',
    description:
      'Obtiene estadísticas generales: total de boletas, pagadas, pendientes, canceladas y monto total de ventas',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  getEstadisticas() {
    return this.boletasService.getEstadisticas();
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({
    summary: 'Listar boletas por usuario',
    description: 'Obtiene todas las boletas de un usuario específico',
  })
  @ApiParam({
    name: 'usuarioId',
    description: 'ID del usuario',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Boletas del usuario encontradas',
  })
  findByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.boletasService.findByUsuario(usuarioId);
  }

  @Get('numero/:numero')
  @ApiOperation({
    summary: 'Buscar boleta por número',
    description: 'Obtiene una boleta específica por su número único',
  })
  @ApiParam({
    name: 'numero',
    description: 'Número de boleta',
    example: 'BOL-2024-0001',
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta no encontrada',
  })
  findByNumero(@Param('numero') numero: string) {
    return this.boletasService.findByNumero(numero);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener boleta por ID',
    description: 'Obtiene los detalles completos de una boleta por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID numérico de la boleta',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta no encontrada',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.boletasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar estado de boleta',
    description:
      'Actualiza el estado de una boleta (PENDIENTE, PAGADA, CANCELADA)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID numérico de la boleta',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Boleta actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta no encontrada',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBoletaDto: UpdateBoletaDto,
  ) {
    return this.boletasService.update(id, updateBoletaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar boleta',
    description:
      'Elimina una boleta del sistema. No se pueden eliminar boletas pagadas.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID numérico de la boleta',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Boleta eliminada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar una boleta pagada',
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta no encontrada',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.boletasService.remove(id);
  }
}
