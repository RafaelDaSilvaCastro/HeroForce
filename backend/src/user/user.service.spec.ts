import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

const mockUserRepo = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
} as any;

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll deve retornar lista de usuários', async () => {
    mockUserRepo.find.mockResolvedValue([{ id: '1', name: 'Peter' }]);
    const result = await service.findAll();
    expect(result).toHaveLength(1);
  });

  it('findByEmail deve retornar usuário pelo email', async () => {
    mockUserRepo.findOneBy.mockResolvedValue({ id: '1', email: 'test@test.com' });
    const result = await service.findByEmail('test@test.com');
    expect(result).toHaveProperty('email', 'test@test.com');
  });
});