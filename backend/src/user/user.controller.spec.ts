import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const mockUserService = {
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Peter' }),
  create: jest.fn().mockResolvedValue({ id: '1', name: 'Peter' }),
  update: jest.fn().mockResolvedValue({ id: '1' }),
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
});