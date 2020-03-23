import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { userProviders } from './users.providers';
import { ThreadModule } from 'src/thread/thread.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { EmailModule } from 'src/email/email.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    EmailModule,
    ThreadModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UsersService, ...userProviders],
  exports: [UsersService],
})
export class UsersModule {}
