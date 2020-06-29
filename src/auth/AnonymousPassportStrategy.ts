import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class AnonymousStrategy extends PassportStrategy(
  JwtStrategy,
  'anonymous',
) {
  constructor() {
    super();
  }

  authenticate() {
    return this.success({});
  }
}
