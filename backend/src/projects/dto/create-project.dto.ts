import { IsArray, IsEnum, IsString, IsUUID } from "class-validator";
import { Project, ProjectGoal, ProjectStatus } from "../entities/project.entity";

export class CreateProjectDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsEnum(ProjectStatus)
  status!: ProjectStatus;

  @IsArray()
  @IsEnum(ProjectGoal, { each: true })
  goals!: ProjectGoal[];

  @IsUUID()
  userId!: string;
}
