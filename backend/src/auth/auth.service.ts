import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // Since this is for personal use, we'll use a hardcoded admin account
  // In a production environment, this would be stored in a database
  private readonly adminUser = {
    username: 'admin',
    // This is a hashed version of 'password' - in production, use a strong password
    passwordHash:
      '$2b$10$YBQWh0G6c0t5.fgh7lT4IOZ8BjpJG.XvGHN1c1Qg.rPHT5CU8ZMNa',
  };

  constructor(private readonly jwtService: JwtService) {}

  async validateAdmin(username: string, password: string): Promise<boolean> {
    // Only allow the admin user to login
    if (username !== this.adminUser.username) {
      return false;
    }

    // Check if password matches the stored hash
    const isPasswordValid = await bcrypt.compare(
      password,
      this.adminUser.passwordHash,
    );
    return isPasswordValid;
  }

  async login(username: string, password: string) {
    const isValid = await this.validateAdmin(username, password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username, sub: 'admin' };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
