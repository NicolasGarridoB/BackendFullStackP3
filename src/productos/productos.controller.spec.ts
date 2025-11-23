import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create.product.dto';
import { UpdateProductoDto } from './dto/update.product.dto';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: jest.Mocked<ProductosService>;

  beforeEach(async () => {
    const serviceMock: Partial<jest.Mocked<ProductosService>> = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [{ provide: ProductosService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ProductosController>(ProductosController);
    service = module.get(ProductosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delegates to service', async () => {
    const dto = { nombre: 'A' } as CreateProductoDto;
    const returned = { id: 1, nombre: 'A' } as any;
    service.create.mockResolvedValue(returned);

    await expect(controller.create(dto)).resolves.toBe(returned);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('findAll delegates to service', async () => {
    const list = [{ id: 1 }] as any;
    service.findAll.mockResolvedValue(list);
    await expect(controller.findAll()).resolves.toBe(list);
  });

  it('findOne delegates to service', async () => {
    const item = { id: 5 } as any;
    service.findOne.mockResolvedValue(item);
    await expect(controller.findOne(5)).resolves.toBe(item);
    expect(service.findOne).toHaveBeenCalledWith(5);
  });

  it('update delegates to service', async () => {
    const dto = { nombre: 'B' } as UpdateProductoDto;
    const updated = { id: 2, nombre: 'B' } as any;
    service.update.mockResolvedValue(updated);

    await expect(controller.update(2, dto)).resolves.toBe(updated);
    expect(service.update).toHaveBeenCalledWith(2, dto);
  });

  it('remove delegates to service', async () => {
    service.remove.mockResolvedValue(undefined as any);
    await expect(controller.remove(3)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(3);
  });
});
