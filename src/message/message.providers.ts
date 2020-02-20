import { Message } from 'src/message/models/message.entity';
import { MESSAGE_REPOSITORY } from 'src/appConsts/sequelizeRepository';

export const messageProviders = [
  {
    provide: MESSAGE_REPOSITORY,
    useValue: Message,
  },
];
