import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SigninDto } from './dto/signin.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @ApiOperation({
    summary: 'Registrar um novo usuário',
    description: 'Cria uma nova conta de usuário com as informações fornecidas'
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Dados necessários para o registro do usuário'
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso'
  })
  @ApiResponse({
    status: 400,
    description: 'Validação falhou. Email inválido, senha muito curta ou dados obrigatórios faltando'
  })
  @ApiResponse({
    status: 409,
    description: 'Email já cadastrado no sistema'
  })
  singUp(@Body() body: CreateUserDto) {
    const { email, password, name, character, role } = body;
    return this.authService.singUp(email, password, name, character, role);
  }

  @Post('signin')
  @ApiOperation({
    summary: 'Fazer login do usuário',
    description: 'Autentica um usuário e retorna um token JWT'
  })
  @ApiBody({ type: SigninDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso'
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas (email ou senha incorretos)'
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado'
  })
  signin(@Body() signinDto: SigninDto) {
    const { email, password } = signinDto;
    return this.authService.singin(email, password);
  }
}
