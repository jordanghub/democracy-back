import { USER_REPOSITORY } from 'src/appConsts/sequelizeRepository';
import { User } from './user.entity';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
