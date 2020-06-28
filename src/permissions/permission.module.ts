import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PermissionService } from './permissions.service';
// import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [DatabaseModule],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
