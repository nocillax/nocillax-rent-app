import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test.jwt.token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateAdmin', () => {
    it('should return false for non-admin username', async () => {
      const result = await service.validateAdmin('notadmin', 'password');
      expect(result).toBe(false);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return true for valid admin credentials', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.validateAdmin('admin', 'correctpassword');

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'correctpassword',
        expect.any(String),
      );
      expect(result).toBe(true);
    });

    it('should return false for invalid admin password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await service.validateAdmin('admin', 'wrongpassword');

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        expect.any(String),
      );
      expect(result).toBe(false);
    });
  });

  describe('login', () => {
    it('should return JWT token for valid credentials', async () => {
      jest.spyOn(service, 'validateAdmin').mockResolvedValueOnce(true);

      const result = await service.login('admin', 'correctpassword');

      expect(service.validateAdmin).toHaveBeenCalledWith(
        'admin',
        'correctpassword',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'admin',
        sub: 'admin',
      });
      expect(result).toEqual({ access_token: 'test.jwt.token' });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(service, 'validateAdmin').mockResolvedValueOnce(false);

      await expect(service.login('admin', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(service.validateAdmin).toHaveBeenCalledWith(
        'admin',
        'wrongpassword',
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
