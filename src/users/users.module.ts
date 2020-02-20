import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { userProviders } from './users.providers';
import { ThreadModule } from 'src/thread/thread.module';

@Module({
  imports: [ThreadModule],
  controllers: [UserController],
  providers: [UsersService, ...userProviders],
  exports: [UsersService],
})
export class UsersModule {}
