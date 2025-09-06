import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

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

  describe('validate', () => {
    it('should return user object based on JWT payload', async () => {
      const payload = { sub: '1', username: 'admin' };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: '1',
        username: 'admin',
      });
    });
  });
});
