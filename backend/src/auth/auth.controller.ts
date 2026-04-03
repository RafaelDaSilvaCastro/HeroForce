import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  singUp(@Body() body: any) {
    const { email, password, name, character, role } = body;
    return this.authService.singUp(email, password, name, character, role);
  }

 @Post('singin')
  singin(@Body() body: any) {
    const { email, password } = body;
    return this.authService.singin(email, password);
  } 
}
