import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ password, email, username, nombre, role }: RegisterDto) {
    // Verificar si el email ya existe
    const userByEmail = await this.usersService.findByEmail(email);
    if (userByEmail) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Verificar si el username ya existe
    const userByUsername = await this.usersService.findByUsername(username);
    if (userByUsername) {
      throw new BadRequestException('El nombre de usuario ya está en uso');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await this.usersService.create({
      username,
      nombre,
      email,
      password: hashedPassword,
      role: role || UserRole.CLIENTE,
    });

    return { message: 'Usuario registrado correctamente' };
  }

  async login({ usernameOrEmail, password }: LoginDto) {
    // Buscar por username o email
    let user = await this.usersService.findByUsername(usernameOrEmail);
    if (!user) {
      user = await this.usersService.findByEmail(usernameOrEmail);
    }

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña inválida');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      nombre: user.nombre,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nombre: user.nombre,
        role: user.role,
      },
    };
  }
}
