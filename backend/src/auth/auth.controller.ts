import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    description: 'Usuário registrado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'peter.parker@gmail.com',
        name: 'Peter Parker',
        character: 'Homem-Aranha',
        role: 'user',
        createdAt: '2024-01-15T10:30:00Z'
      }
    }
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
  @ApiBody({ 
    type: Object,
    description: 'Credenciais do usuário',
    examples: {
      example: {
        value: {
          email: 'peter.parker@gmail.com',
          password: 'password123'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login realizado com sucesso',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'peter.parker@gmail.com',
          name: 'Peter Parker'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciais inválidas (email ou senha incorretos)'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado'
  })
  signin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.singin(email, password);
  } 
}
