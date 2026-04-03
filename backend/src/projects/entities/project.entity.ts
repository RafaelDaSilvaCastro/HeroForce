import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum ProjectStatus {
  PENDING = 'pendente',
  IN_PROGRESS = 'em andamento',
  DONE = 'concluído',
}

export enum ProjectGoal{
  AGILITY = 'agilidade',
  ENCHANTMENT = 'encantamento',
  EFFICIENCY = 'eficiência',
  EXCELLENCE = 'excelência',
  TRANSPARENCY = 'transparência',
  AMBITION = 'ambição',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.PENDING })
  status!: ProjectStatus;

  @Column({ type: 'simple-array' })
  goals!: ProjectGoal[];

  @ManyToOne(() => User, user => user.projects)
  user!: User;


}
