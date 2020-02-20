import {
  Table,
  Column,
  Model,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript';
import { Thread } from 'src/thread/models/thread.entity';
import { User } from 'src/users/models/user.entity';

@Table({
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['thread_id', 'user_id'],
    },
  ],
})
export class ThreadFollowers extends Model {
  @AllowNull(false)
  @ForeignKey(() => Thread)
  @Column
  threadId: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId: number;
}
