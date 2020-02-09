import { Sequelize } from 'sequelize-typescript';
import { Thread } from 'src/thread/thread.entity';
import { Message } from 'src/message/message.entity';
import { Category } from 'src/categories/category.entity';
import { ThreadCategory } from 'src/categories/thread-category.entity';
import { User } from 'src/users/user.entity';
import { ScoringLabel } from 'src/scoring/scoring-label.entity';
import { Scoring } from 'src/scoring/scoring.entity';
import { MessageSource } from 'src/message/message-source.entity';
import { UserTokens } from 'src/users/user-tokens';
import { ThreadRef } from 'src/thread/thread-ref.entity';
import { MessageRef } from 'src/message/message-ref.entity';
import { Selection } from 'src/thread/selection.entity';

const models = [
  Thread,
  Message,
  Category,
  ThreadCategory,
  User,
  ScoringLabel,
  Scoring,
  MessageSource,
  ThreadRef,
  MessageRef,
  Selection,
  UserTokens,
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
      });
      sequelize.addModels(models);
      // await sequelize.sync({ force: true });
      return sequelize;
    },
  },
];
