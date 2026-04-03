import { IsEmail, IsString, Min, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;
  
  @IsString()
  character!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  role!: string;
}
