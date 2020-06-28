import { join } from 'path';

import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './categories/categories.module';
import { ThreadModule } from './thread/thread.module';
import { DatabaseModule } from './database/database.module';
import { MessageModule } from './message/message.module';
import { ScoringModule } from './scoring/scoring.module';
import { EmailModule } from './email/email.module';
import { WebsocketModule } from './sockets/socket.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    ThreadModule,
    CategoryModule,
    MessageModule,
    ScoringModule,
    EmailModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
