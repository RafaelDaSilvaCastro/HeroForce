import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { User } from '../user/entities/user.entity';

const mockProjectRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
} as any;

const mockUserRepo = {
  findOneBy: jest.fn(),
} as any;

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getRepositoryToken(Project), useValue: mockProjectRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll deve retornar lista de projetos', async () => {
    mockProjectRepo.find.mockResolvedValue([{ id: '1', name: 'Projeto Teste' }]);
    const result = await service.findAll();
    expect(result).toHaveLength(1);
  });

  it('create deve lançar erro se usuário não existir', async () => {
    mockUserRepo.findOneBy.mockResolvedValue(null);
    await expect(service.create({
      name: 'Projeto', description: '', status: 'pendente' as any,
      goals: [], userId: 'invalido',
    })).rejects.toThrow();
  });

  it('update deve lançar erro se projeto não existir', async () => {
    mockProjectRepo.findOneBy.mockResolvedValue(null);
    await expect(service.update('id-invalido', { status: 'concluído' as any })).rejects.toThrow();
  });
});