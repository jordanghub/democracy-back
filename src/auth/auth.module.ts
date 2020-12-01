import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { AnonymousStrategy } from './AnonymousPassportStrategy';
import { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } from 'src/appConsts/jwt';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      publicKey: JWT_PUBLIC_KEY,
      privateKey: JWT_PRIVATE_KEY,
      signOptions: { expiresIn: '3600s', algorithm: 'RS256' },
    }),
  ],
  providers: [AuthService, LocalStrategy, AnonymousStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
