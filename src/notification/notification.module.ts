import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { WebsocketModule } from 'src/sockets/socket.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [DatabaseModule, WebsocketModule],
  exports: [NotificationService],
  providers: [NotificationService],
})
export class NotificationModule {}
