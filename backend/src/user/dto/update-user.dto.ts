import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: 'Peter Parker', description: 'Nome do usuário (opcional)' })
  name?: string;

  @ApiPropertyOptional({ example: 'peter.parker@gmail.com', description: 'Email do usuário (opcional)' })
  email?: string;

  @ApiPropertyOptional({ example: 'Homem-Aranha', description: 'Personagem do usuário (opcional)' })
  character?: string;

  @ApiPropertyOptional({ example: 'password123', description: 'Senha do usuário (opcional)' })
  password?: string;

  @ApiPropertyOptional({ example: 'user', description: 'Role do usuário (opcional)' })
  role?: string;
}
