import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Inyectar datos iniciales en la base de datos' })
  @ApiResponse({
    status: 201,
    description: 'Datos insertados correctamente',
  })
  async seed() {
    return this.seedService.seed();
  }
}
