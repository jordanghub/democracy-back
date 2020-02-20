import {
  Table,
  Column,
  Model,
  ForeignKey,
  AllowNull,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { Thread } from 'src/thread/models/thread.entity';
import { User } from 'src/users/models/user.entity';

@Table({ underscored: true })
export class ThreadNotification extends Model {
  @AllowNull(false)
  @ForeignKey(() => Thread)
  @Column
  threadId: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Default(true)
  @Column
  active: boolean;

  @BelongsTo(() => Thread)
  thread: Thread;

  @BelongsTo(() => User)
  user: User;
}
