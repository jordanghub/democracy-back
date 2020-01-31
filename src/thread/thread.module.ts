import { Module } from '@nestjs/common';
import { ThreadController } from './thread.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ThreadService } from './thread.service';
import { threadProviders } from 'src/thread/thread.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ThreadController],
  providers: [
    ThreadService,
    ...threadProviders,
  ],
})
export class ThreadModule {}
