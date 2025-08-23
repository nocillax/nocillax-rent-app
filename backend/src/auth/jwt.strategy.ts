import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Extract JWT from the cookie
        (request: Request) => {
          const token = request?.cookies?.jwt;
          if (!token) {
            return null;
          }
          return token;
        },
        // Also allow token in Authorization header as fallback
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: 'yourSecretKey', // In production, use environment variables
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}