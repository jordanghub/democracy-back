import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { threadProviders } from 'src/thread/thread.providers';
import { WebSocketGatewayServer } from 'src/sockets/gateway';
import { MessageModule } from 'src/message/message.module';
import { PermissionService } from './permissions.service';
// import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [DatabaseModule],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
