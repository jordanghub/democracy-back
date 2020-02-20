import { Category } from 'src/categories/models/category.entity';
import { CATEGORY_REPOSITORY } from 'src/appConsts/sequelizeRepository';

export const categoriesProviders = [
  {
    provide: CATEGORY_REPOSITORY,
    useValue: Category,
  },
];
