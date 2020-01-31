import { Table, Column, Model, ForeignKey, Unique, DataType, BelongsTo, HasMany, AllowNull } from 'sequelize-typescript';
import { Thread } from 'src/thread/thread.entity';
import { User } from 'src/users/user.entity';
import { Scoring } from 'src/scoring/scoring.entity';

@Table
export class Message extends Model {

  @Unique
  @Column(DataType.TEXT)
  content: string;

  @AllowNull(false)
  @ForeignKey(() => Thread)
  @Column
  threadId: number;

  @BelongsTo(() => Thread)
  thread: Thread;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  author: User;

  @HasMany(() => Scoring)
  votes: Scoring[];
}
