import { Sequelize } from 'sequelize-typescript';
import { Thread } from 'src/thread/models/thread.entity';
import { Message } from 'src/message/models/message.entity';
import { Category } from 'src/categories/models/category.entity';
import { ThreadCategory } from 'src/categories/models/thread-category.entity';
import { User } from 'src/users/models/user.entity';
import { ScoringLabel } from 'src/scoring/models/scoring-label.entity';
import { Scoring } from 'src/scoring/scoring.entity';
import { MessageSource } from 'src/message/models/message-source.entity';
import { UserTokens } from 'src/users/models/user-tokens.entity';
import { MessageRef } from 'src/message/models/message-ref.entity';
import { Selection } from 'src/thread/models/selection.entity';
import { ThreadFollowers } from 'src/thread/models/thread-followers.entity';
import { ThreadNotification } from 'src/notification/models/thread-notification.entity';

const models = [
  Thread,
  Message,
  Category,
  ThreadCategory,
  User,
  ScoringLabel,
  Scoring,
  MessageSource,
  MessageRef,
  Selection,
  UserTokens,
  ThreadFollowers,
  ThreadNotification,
];

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'coucou1.5',
        database: 'democracy',
        logging: true,
      });
      sequelize.addModels(models);
      await sequelize.sync();
      return sequelize;
    },
  },
];
