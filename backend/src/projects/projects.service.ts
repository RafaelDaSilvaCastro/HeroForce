import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const user = await this.userRepository.findOneBy({ id: createProjectDto.userId });
    if (!user) throw new Error('User not found');

    const project = this.repository.create({
      ...createProjectDto,
      user,
    });

    return this.repository.save(project);
  }

  findAll() {
    return this.repository.find({ relations: ['user'] }); // 👈 traz o user junto
  }

  findOne(id: string) {
    return this.repository.findOne({ where: { id }, relations: ['user'] });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.repository.findOneBy({ id });
    if (!project) throw new Error('Project not found');
    this.repository.merge(project, updateProjectDto);
    return this.repository.save(project);
  }

  async remove(id: string) {
    const project = await this.repository.findOneBy({ id });
    if (!project) throw new Error('Project not found');
    return this.repository.remove(project);
  }
}