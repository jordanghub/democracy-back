import { Module } from '@nestjs/common';
import { ThreadController } from './thread.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ThreadService } from './thread.service';
import { threadProviders } from 'src/thread/thread.providers';
// import { WebSocketGatewayServer } from 'src/sockets/gateway';
import { MessageModule } from 'src/message/message.module';
import { PermissionModule } from 'src/permissions/permission.module';
import { WebsocketModule } from 'src/sockets/socket.module';
// import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [DatabaseModule, MessageModule, PermissionModule, WebsocketModule],
  controllers: [ThreadController],
  providers: [
    // WebSocketGatewayServer,
    // NotificationService, future notificaiton
    ThreadService,
    ...threadProviders,
  ],
  exports: [ThreadService],
})
export class ThreadModule {}
