import {
  Table,
  Column,
  Model,
  ForeignKey,
  Unique,
  AllowNull,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table({ underscored: true })
export class UserTokens extends Model {
  @AllowNull(false)
  @Unique
  @Column
  refreshToken: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId: string;
}
