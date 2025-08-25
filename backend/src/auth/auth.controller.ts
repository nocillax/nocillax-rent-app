import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/auth/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticates a user and returns a JWT token in an HTTP-only cookie',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { access_token } = await this.authService.login(
        loginDto.username,
        loginDto.password,
      );

      // Set JWT token as an HTTP-only cookie
      response.cookie('jwt', access_token, {
        httpOnly: true, // Prevents client-side JS from reading the cookie
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        sameSite: 'strict', // Prevents CSRF
        maxAge: 24 * 60 * 60 * 1000, // Cookie expires after 24 hours
      });

      return { message: 'Login successful' };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @ApiOperation({
    summary: 'User logout',
    description: 'Clears the authentication cookie',
  })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    // Clear the JWT cookie
    response.clearCookie('jwt');
    return { message: 'Logout successful' };
  }
}
