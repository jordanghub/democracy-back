import { Module } from '@nestjs/common';
import { CategoryController } from './categories.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryService } from './categories.service';
import { categoriesProviders } from 'src/categories/categories.providers';
import { ThreadService } from 'src/thread/thread.service';
import { threadProviders } from 'src/thread/thread.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    ...threadProviders,
    ...categoriesProviders,
  ],
})
export class CategoryModule {}
