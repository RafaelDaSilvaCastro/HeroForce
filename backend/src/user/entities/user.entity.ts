import { Project } from "src/projects/entities/project.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "src/enum/character";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

@Column({ type: 'enum', enum: Character })
character!: Character;

  @Column()
  password!: string;

  @Column({default: 'user'})
  role!: string;

  @OneToMany(() => Project, project => project.user)
  projects!: Project[];
}