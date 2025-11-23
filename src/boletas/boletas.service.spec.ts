import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { BoletasService } from './boletas.service';
import { Boleta, EstadoBoleta } from './entities/boleta.entity';
import { BoletaDetalle } from './entities/boleta-detalle.entity';
import { Producto } from '../productos/entities/producto.entity';

function createRepositoryMock() {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
}

describe('BoletasService', () => {
  let service: BoletasService;
  let boletaRepo: any;
  let detalleRepo: any;
  let productoRepo: any;
  let dataSource: any;

  beforeEach(async () => {
    boletaRepo = createRepositoryMock();
    detalleRepo = createRepositoryMock();
    productoRepo = createRepositoryMock();
    
    dataSource = {
      createQueryRunner: jest.fn(() => ({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn(),
        },
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoletasService,
        {
          provide: getRepositoryToken(Boleta),
          useValue: boletaRepo,
        },
        {
          provide: getRepositoryToken(BoletaDetalle),
          useValue: detalleRepo,
        },
        {
          provide: getRepositoryToken(Producto),
          useValue: productoRepo,
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    service = module.get<BoletasService>(BoletasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns all boletas', async () => {
      const items = [{ id: 1 } as Boleta, { id: 2 } as Boleta];
      boletaRepo.find.mockResolvedValue(items);
      await expect(service.findAll()).resolves.toEqual(items);
    });
  });

  describe('findOne', () => {
    it('returns a boleta by id', async () => {
      const item = { id: 1, numero: 'BOL-2024-0001' } as Boleta;
      boletaRepo.findOne.mockResolvedValue(item);
      await expect(service.findOne(1)).resolves.toEqual(item);
    });

    it('throws NotFoundException if not found', async () => {
      boletaRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(123)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('findByUsuario', () => {
    it('returns boletas for a user', async () => {
      const items = [{ id: 1, usuarioId: 5 } as Boleta];
      boletaRepo.find.mockResolvedValue(items);
      await expect(service.findByUsuario(5)).resolves.toEqual(items);
    });
  });

  describe('remove', () => {
    it('removes a boleta if not PAGADA', async () => {
      const boleta = { id: 1, estado: EstadoBoleta.PENDIENTE } as Boleta;
      boletaRepo.findOne.mockResolvedValue(boleta);
      boletaRepo.remove.mockResolvedValue(boleta);
      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('throws BadRequestException if boleta is PAGADA', async () => {
      const boleta = { id: 1, estado: EstadoBoleta.PAGADA } as Boleta;
      boletaRepo.findOne.mockResolvedValue(boleta);
      await expect(service.remove(1)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });
});
