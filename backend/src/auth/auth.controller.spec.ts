import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/auth/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockResponse = () => {
    const res: any = {};
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should set a JWT cookie and return success message on successful login', async () => {
      const loginDto: LoginDto = {
        username: 'admin',
        password: 'password123',
      };

      const response = mockResponse();
      mockAuthService.login.mockResolvedValueOnce({
        access_token: 'test.jwt.token',
      });

      const result = await controller.login(loginDto, response);

      expect(service.login).toHaveBeenCalledWith('admin', 'password123');
      expect(response.cookie).toHaveBeenCalledWith(
        'jwt',
        'test.jwt.token',
        expect.objectContaining({
          httpOnly: true,
        }),
      );
      expect(result).toEqual({ message: 'Login successful' });
    });

    it('should throw UnauthorizedException when login fails', async () => {
      const loginDto: LoginDto = {
        username: 'admin',
        password: 'wrongpassword',
      };

      const response = mockResponse();
      mockAuthService.login.mockRejectedValueOnce(
        new Error('Invalid credentials'),
      );

      await expect(controller.login(loginDto, response)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(service.login).toHaveBeenCalledWith('admin', 'wrongpassword');
      expect(response.cookie).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear the JWT cookie and return success message', async () => {
      const response = mockResponse();

      const result = await controller.logout(response);

      expect(response.clearCookie).toHaveBeenCalledWith('jwt');
      expect(result).toEqual({ message: 'Logout successful' });
    });
  });
});
