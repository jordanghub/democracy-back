import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { emailProviders } from './email.providers';

@Module({
  providers: [EmailService, ...emailProviders],
  exports: [EmailService],
})
export class EmailModule {}
