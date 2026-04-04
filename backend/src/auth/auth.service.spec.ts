// src/user/user.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';

const mockUserService = {
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Peter' }),
  create: jest.fn().mockResolvedValue({ id: '1', name: 'Peter' }),
  update: jest.fn().mockResolvedValue({ id: '1', name: 'Peter Updated' }),
  remove: jest.fn().mockResolvedValue({ id: '1' }),
  findByEmail: jest.fn().mockResolvedValue(null),
} as any;

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService }, 
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('findAll deve retornar lista de usuários', async () => {
    mockUserService.findAll.mockResolvedValue([{ id: '1', name: 'Peter' }]);
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
  });

  it('create deve lançar erro se email já em uso', async () => {
    mockUserService.findByEmail.mockResolvedValue({ id: '1', email: 'test@test.com' });
    await expect(controller.create({
      name: 'Peter', email: 'test@test.com', password: '123456', character: 'Spider-Man' as any,
    })).rejects.toThrow();
  });

  it('findOne deve lançar erro se usuário não existir', async () => {
    mockUserService.findOne.mockResolvedValue(null);
    await expect(controller.findOne('id-invalido')).rejects.toThrow();
  });
});