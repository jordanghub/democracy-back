import { Module } from '@nestjs/common';
import { ThreadController } from './thread.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ThreadService } from './thread.service';
import { threadProviders } from 'src/thread/thread.providers';
import { MessageService } from 'src/message/message.service';
import { messageProviders } from 'src/message/message.providers';
import { WebSocketGatewayServer } from 'src/sockets/gateway';

@Module({
  imports: [DatabaseModule],
  controllers: [ThreadController],
  providers: [
    WebSocketGatewayServer,
    ThreadService,
    MessageService,
    ...threadProviders,
    ...messageProviders,
  ],
})
export class ThreadModule {}
