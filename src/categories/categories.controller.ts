import { Controller, Get, Request, Query, Param } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { Category } from './models/category.entity';
import { formatThreadLatest } from 'src/utils/formatThread';
import { getPaginationParams } from 'src/utils/sequelize-pagination';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllThreads(@Request() req) {
    const categories = await this.categoryService.findAll();

    return categories;
  }

  @Get('/:id/threads')
  async getThreadsByWithCategory(
    @Request() req,
    @Query('page') page,
    @Param('id') id,
  ) {
    const result = await this.categoryService.findThreadByCategory(
      id,
      page || 1,
      5,
    );

    const threads = result.rows.map(thread => formatThreadLatest(thread));

    const data = getPaginationParams(threads, result.count, page, 5);
    return data;
  }
}
