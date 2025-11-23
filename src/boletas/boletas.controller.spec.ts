import { Test, TestingModule } from '@nestjs/testing';
import { BoletasController } from './boletas.controller';
import { BoletasService } from './boletas.service';

describe('BoletasController', () => {
  let controller: BoletasController;
  let service: jest.Mocked<BoletasService>;

  beforeEach(async () => {
    const serviceMock: Partial<jest.Mocked<BoletasService>> = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByUsuario: jest.fn(),
      findByNumero: jest.fn(),
      getEstadisticas: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoletasController],
      providers: [{ provide: BoletasService, useValue: serviceMock }],
    }).compile();

    controller = module.get<BoletasController>(BoletasController);
    service = module.get(BoletasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delegates to service', async () => {
    const dto = { detalles: [] } as any;
    const req = { user: { sub: 1 } };
    const returned = { id: 1, numero: 'BOL-2024-0001' } as any;
    service.create.mockResolvedValue(returned);

    await expect(controller.create(dto, req)).resolves.toBe(returned);
    expect(service.create).toHaveBeenCalledWith(dto, 1);
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
  });

  it('update delegates to service', async () => {
    const dto = { estado: 'PAGADA' } as any;
    const updated = { id: 3, estado: 'PAGADA' } as any;
    service.update.mockResolvedValue(updated);
    await expect(controller.update(3, dto)).resolves.toBe(updated);
  });

  it('remove delegates to service', async () => {
    service.remove.mockResolvedValue(undefined);
    await expect(controller.remove(2)).resolves.toBeUndefined();
  });
});
