import {
  Table,
  Column,
  Model,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.entity';
import { Scoring } from '../scoring.entity';
import { Message } from 'src/message/models/message.entity';
import { Thread } from 'src/thread/models/thread.entity';

@Table({
  indexes: [
    {
      unique: true,
      fields: ['messageId', 'userId'],
    },
  ],
})
export class ThreadMessageScoring extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Message)
  @Column
  messageId: number;

  @ForeignKey(() => Thread)
  @Column
  threadId: number;

  @HasMany(() => Scoring)
  scoringValues: Scoring[];
}
