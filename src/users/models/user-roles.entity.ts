import {
  Table,
  Column,
  Model,
  ForeignKey,
  Unique,
  AllowNull,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Role } from './role.entity';

@Table({ underscored: true })
export class UserRole extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;
}
