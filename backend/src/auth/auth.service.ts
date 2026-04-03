import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { UserService } from 'src/user/user.service';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}
  
  getHello(): string {
    return 'Hello World!';
  }

  async singUp(email: string, password: string, name: string, character: string, role: string = 'user') {
    const user = await this.userService.findByEmail(email);
    if (user) {
      return new BadRequestException('Email already in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = await scrypt(password, salt, 32) as Buffer;
    const saltAndHash = salt + '.' + hash.toString('hex');

    const newUser = await this.userService.create({ email, password: saltAndHash, name, character, role});

    const { password: _, ...result } = newUser;
    return result;
  }

  async singin(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return new UnauthorizedException('Invalid email or password');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = await scrypt(password, salt, 32) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      return new UnauthorizedException('Invalid email or password');
    }

    console.log('User authenticated successfully');
    console.log('Sing in:', user);

    const payload = {email: user.email, sub: user.id, role: user.role};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
