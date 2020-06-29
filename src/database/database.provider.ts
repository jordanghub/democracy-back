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
import { Role } from 'src/users/models/role.entity';
import { UserRole } from 'src/users/models/user-roles.entity';
import { ThreadLockedData } from 'src/thread/models/thread-lock-data.entity';
import { Notification } from 'src/notification/models/notification';

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
  Role,
  UserRole,
  ThreadLockedData,
  Notification,
];

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT, 10),
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        logging: false,
        define: {
          collate: 'utf8mb4_unicode_ci',
          charset: 'utf8mb4',
        },
      });
      sequelize.addModels(models);
      await sequelize.sync();
      return sequelize;
    },
  },
];
