import { Injectable, Inject } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from 'src/appConsts/sequelizeRepository';
import { Thread } from 'src/thread/thread.entity';
import { Category } from 'src/categories/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: typeof Category,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll<Category>({
      attributes: ['id', 'name'],
    });
  }

}
