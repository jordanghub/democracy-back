import { Thread } from 'src/thread/thread.entity';
import { THREAD_REPOSITORY } from 'src/appConsts/sequelizeRepository';

export const threadProviders = [
  {
    provide: THREAD_REPOSITORY,
    useValue: Thread,
  },
];
