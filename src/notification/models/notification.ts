import {
  Table,
  Column,
  Model,
  ForeignKey,
  AllowNull,
  BelongsTo,
  Default,
  DataType,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.entity';

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

  @Column(DataType.JSON)
  payload: JSON;

  @BelongsTo(() => User)
  user: User;
}
