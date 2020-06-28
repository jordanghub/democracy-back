import {
  Table,
  Column,
  Model,
  ForeignKey,
  AllowNull,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.entity';
import { JSON } from 'sequelize/types';

@Table({ underscored: true })
export class Notification extends Model {
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Default(true)
  @Column
  active: boolean;

  @Column
  type: string;

  @Column
  payload: JSON;

  @BelongsTo(() => User)
  user: User;
}
