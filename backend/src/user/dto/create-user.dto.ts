import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Min, MinLength } from "class-validator";

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
  @ApiProperty({ example: 'user' })
  role!: string;
}
