import { Module } from '@nestjs/common';
import { MessageController } from 'src/message/message.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MessageService } from 'src/message/message.service';
import { messageProviders } from 'src/message/message.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [MessageController],
  providers: [
    MessageService,
    ...messageProviders,
  ],
})
export class MessageModule {}
