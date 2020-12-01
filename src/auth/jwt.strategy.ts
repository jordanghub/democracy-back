import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWT_PUBLIC_KEY } from 'src/appConsts/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_PUBLIC_KEY,
      signOptions: {
        algorithm: 'RS256',
      },
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
