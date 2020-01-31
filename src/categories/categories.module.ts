import { Module } from '@nestjs/common';
import { CategoryController } from './categories.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryService } from './categories.service';
import { categoriesProviders } from 'src/categories/categories.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    ...categoriesProviders,
  ],
})
export class CategoryModule {}
