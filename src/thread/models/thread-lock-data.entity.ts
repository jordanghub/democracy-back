import {
  Table,
  Column,
  Model,
  ForeignKey,
  Unique,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';
import { Message } from 'src/message/models/message.entity';
import { ThreadCategory } from 'src/categories/models/thread-category.entity';
import { User } from 'src/users/models/user.entity';
import { Selection } from './selection.entity';
import { ThreadFollowers } from './thread-followers.entity';
import { Scoring } from 'src/scoring/scoring.entity';
import { Thread } from './thread.entity';

@Table({ underscored: true })
export class ThreadLockedData extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Thread)
  @Unique
  @Column
  threadId: number;

  @AllowNull(true)
  @Column
  reason: string;

  @BelongsTo(() => User)
  user: User;
}
