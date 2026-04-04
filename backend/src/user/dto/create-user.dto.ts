import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'Peter Parker' })
  name!: string;

  @IsEmail()
  @ApiProperty({ example: 'peter.parker@gmail.com' })
  email!: string;

  @IsString()
  @ApiProperty({ example: 'Homem-Aranha' })
  character!: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'password123' })
  password!: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'user', default: 'user', description: 'Role do usuário (padrão: user)' })
  role?: string;
}
