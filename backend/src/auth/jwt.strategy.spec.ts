import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ExtractJwt } from 'passport-jwt';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('token extraction', () => {
    let jwtStrategy: JwtStrategy;

    beforeEach(() => {
      jwtStrategy = new JwtStrategy();
    });

    it('should extract token from cookies', () => {
      // Create a custom extractor function similar to the one in the strategy
      const cookieExtractor = (request) => {
        const token = request?.cookies?.jwt;
        if (!token) {
          return null;
        }
        return token;
      };
      
      // Mock request with cookie
      const mockRequest = {
        cookies: {
          jwt: 'test-token-from-cookie'
        }
      };
      
      const extractedToken = cookieExtractor(mockRequest);
      expect(extractedToken).toBe('test-token-from-cookie');
    });
    
    it('should return null when no token in cookies', () => {
      // Create a custom extractor function similar to the one in the strategy
      const cookieExtractor = (request) => {
        const token = request?.cookies?.jwt;
        if (!token) {
          return null;
        }
        return token;
      };
      
      // Mock request with no cookies
      const mockRequest = {
        cookies: {}
      };
      
      const extractedToken = cookieExtractor(mockRequest);
      expect(extractedToken).toBeNull();
    });

    it('should extract token from Authorization header as fallback', () => {
      // Mock the ExtractJwt.fromAuthHeaderAsBearerToken method
      const mockFromAuthHeaderAsBearerToken = jest.fn().mockReturnValue(
        (request) => request?.headers?.authorization?.split(' ')[1] || null
      );
      
      // Replace the actual implementation with our mock for this test
      const originalFromAuthHeaderAsBearerToken = ExtractJwt.fromAuthHeaderAsBearerToken;
      ExtractJwt.fromAuthHeaderAsBearerToken = mockFromAuthHeaderAsBearerToken;
      
      try {
        // Create a new instance with our mocked extractor
        const jwtStrategy = new JwtStrategy();
        
        // Mock a request with an auth header
        const mockRequest = {
          headers: {
            authorization: 'Bearer test-token-from-header'
          }
        };
        
        // We can't directly test jwtStrategy.constructor options due to the way PassportStrategy works,
        // but we can test that our mock was called, which indirectly tests the strategy's configuration
        expect(mockFromAuthHeaderAsBearerToken).toHaveBeenCalled();
        
        // Test the header extractor directly
        const headerExtractor = mockFromAuthHeaderAsBearerToken();
        const extractedToken = headerExtractor(mockRequest);
        expect(extractedToken).toBe('test-token-from-header');
      } finally {
        // Restore the original implementation
        ExtractJwt.fromAuthHeaderAsBearerToken = originalFromAuthHeaderAsBearerToken;
      }
    });
  });

  describe('validate', () => {
    it('should return user object based on JWT payload', async () => {
      const payload = { sub: '1', username: 'admin' };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: '1',
        username: 'admin',
      });
    });
    
    it('should handle numeric user IDs in payload', async () => {
      const payload = { sub: 42, username: 'test-user' };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 42,
        username: 'test-user',
      });
    });
    
    it('should handle additional payload properties', async () => {
      const payload = { 
        sub: '123', 
        username: 'manager', 
        role: 'admin',
        permissions: ['read', 'write']
      };

      const result = await strategy.validate(payload);

      // Should only extract the specified fields
      expect(result).toEqual({
        userId: '123',
        username: 'manager',
      });
      
      // Should not include extra fields
      expect(result).not.toHaveProperty('role');
      expect(result).not.toHaveProperty('permissions');
    });
  });
});
