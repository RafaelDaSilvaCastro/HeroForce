import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @IsEmail()
  @ApiProperty({ example: 'peter.parker@gmail.com', description: 'Email do usuário' })
  email!: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'password123', description: 'Senha do usuário' })
  password!: string;
}