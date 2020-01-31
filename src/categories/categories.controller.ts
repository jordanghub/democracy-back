import { Controller,  Get, Request } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly threadService: CategoryService) {}

  @Get()
  async getAllThreads(@Request() req) {

    const categories = await this.threadService.findAll();

    return categories;
  }

}
