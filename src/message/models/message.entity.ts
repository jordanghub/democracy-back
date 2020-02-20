import {
  Table,
  Column,
  Model,
  ForeignKey,
  Unique,
  DataType,
  BelongsTo,
  HasMany,
  AllowNull,
} from 'sequelize-typescript';
import { Thread } from 'src/thread/models/thread.entity';
import { User } from 'src/users/models/user.entity';
import { Scoring } from 'src/scoring/scoring.entity';
import { MessageSource } from './message-source.entity';
import { MessageRef } from './message-ref.entity';

@Table({ underscored: true })
export class Message extends Model {
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

  @HasMany(() => MessageSource)
  sources: MessageSource[];

  @HasMany(() => MessageRef)
  highlightedItems: MessageRef[];
}
