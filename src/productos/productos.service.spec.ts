import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductosService } from './productos.service';
import { Producto } from './entities/producto.entity';

// Helper to create a typed mock for TypeORM Repository
function createRepositoryMock() {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<Repository<Producto>>;
}

describe('ProductosService', () => {
  let service: ProductosService;
  let repo: jest.Mocked<Repository<Producto>>;

  beforeEach(async () => {
    repo = createRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(Producto),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates and saves a Pokemon card', async () => {
      const dto = {
        nombre: 'Charizard VMAX',
        descripcion: 'Carta holográfica',
        precio: 15000,
        stock: 10,
        imagen: 'https://ejemplo.com/charizard.jpg',
        rareza: 'Ultra Rare',
        setPokemon: 'Vivid Voltage',
        categoriaId: 1,
      };

      const saved = { id: 1, ...dto, createdAt: new Date(), updatedAt: new Date() };
      repo.create.mockReturnValue(saved as any);
      repo.save.mockResolvedValue(saved as any);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(saved);
    });

    it('throws BadRequestException on save error', async () => {
      const dto = {
        nombre: 'Pikachu',
        precio: 5000,
        stock: 5,
        categoriaId: 1,
      };

      repo.create.mockReturnValue(dto as any);
      repo.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('returns all products', async () => {
      const items = [{ id: 1 } as Producto, { id: 2 } as Producto];
      repo.find.mockResolvedValue(items);
      await expect(service.findAll()).resolves.toEqual(items);
    });
  });

  describe('findOne', () => {
    it('returns a Pokemon card by id', async () => {
      const item = { id: 1, nombre: 'Charizard' } as Producto;
      repo.findOne.mockResolvedValue(item);
      await expect(service.findOne(1)).resolves.toEqual(item);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('throws NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(123)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('merges dto and saves', async () => {
      const existing = { id: 1, nombre: 'Pikachu' } as any;
      const updated = { id: 1, nombre: 'Pikachu', precio: 6000 } as any;
      repo.findOne.mockResolvedValue(existing);
      repo.save.mockImplementation(async (p: any) => p);

      await expect(
        service.update(1, { precio: 6000 } as any),
      ).resolves.toMatchObject({ precio: 6000 });
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('removes after ensuring existence', async () => {
      const item = { id: 7 } as any;
      repo.findOne.mockResolvedValue(item);
      repo.remove.mockResolvedValue(item);

      await expect(service.remove(7)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(item);
    });
  });
});
