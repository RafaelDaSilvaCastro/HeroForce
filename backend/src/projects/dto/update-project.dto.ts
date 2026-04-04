import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus, ProjectGoal } from '../entities/project.entity';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiPropertyOptional({ example: 'Projeto Atualizado', description: 'Nome do projeto (opcional)' })
  name?: string;

  @ApiPropertyOptional({ example: 'Descrição atualizada do projeto', description: 'Descrição do projeto (opcional)' })
  description?: string;

  @ApiPropertyOptional({ example: 'pendente', enum: ProjectStatus, description: 'Status do projeto (opcional)' })
  status?: ProjectStatus;

  @ApiPropertyOptional({ type: [String], enum: ProjectGoal, example: ['agilidade'], description: 'Objetivos do projeto (opcional)' })
  goals?: ProjectGoal[];

  @ApiPropertyOptional({ example: '57e69c99-06f6-4de6-96af-47d3004c2e3d', description: 'ID do usuário (opcional)' })
  userId?: string;
} 
