import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { userProviders } from './users.providers';

@Module({
  controllers: [UserController],
  providers: [UsersService, ...userProviders],
  exports: [UsersService],
})
export class UsersModule {}
