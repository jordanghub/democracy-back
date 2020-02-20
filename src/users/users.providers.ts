import { USER_REPOSITORY } from 'src/appConsts/sequelizeRepository';
import { User } from './models/user.entity';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
