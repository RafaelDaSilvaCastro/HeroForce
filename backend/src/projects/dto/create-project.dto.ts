import { IsArray, IsEnum, IsString, IsUUID } from "class-validator";
import { Project, ProjectGoal, ProjectStatus } from "../entities/project.entity";
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @IsString()
  @ApiProperty({ example: 'Projeto Exemplo', description: 'Nome do projeto' })
  
  name!: string;

  @IsString()
  @ApiProperty({ example: 'Descrição do projeto', description: 'Descrição do projeto' })
  description!: string;

  @IsEnum(ProjectStatus)
  @ApiProperty({ example: 'pendente', enum: ['pendente', 'em andamento', 'concluído'] })
  status!: ProjectStatus;

  @IsArray()
  @IsEnum(ProjectGoal, { each: true })
  @ApiProperty({ type: [String], example: ['agilidade', 'eficiência'] })
  goals!: ProjectGoal[];

  @IsUUID()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID do usuário' })
  userId!: string;
}
