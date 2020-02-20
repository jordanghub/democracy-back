import { Injectable, Inject } from '@nestjs/common';
import {
  CATEGORY_REPOSITORY,
  THREAD_REPOSITORY,
} from 'src/appConsts/sequelizeRepository';
import { Thread } from 'src/thread/models/thread.entity';
import { Category } from 'src/categories/models/category.entity';
import { pagination } from 'src/utils/sequelize-pagination';
import { ThreadCategory } from './models/thread-category.entity';
import { User } from 'src/users/models/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: typeof Category,
    @Inject(THREAD_REPOSITORY) private readonly threadRepository,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll<Category>({
      attributes: ['id', 'name'],
    });
  }

  async findThreadByCategory(id: number, page: number, pageSize: number) {
    return this.threadRepository.findAndCountAll({
      ...pagination({ page, pageSize }),
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'slug', 'createdAt'],
      include: [
        {
          model: ThreadCategory,
          as: 'categoriesFilter',
          where: {
            categoryId: id,
          },
        },
        {
          model: ThreadCategory,
          as: 'categories',
          attributes: ['createdAt'],
          include: [
            {
              model: Category,
              attributes: ['id', 'name'],
            },
          ],
        },
        {
          model: User,
          required: true,
          attributes: ['id', 'username'],
        },
      ],
    });
  }
}
