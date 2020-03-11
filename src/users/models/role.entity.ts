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
export class Role extends Model {
  @AllowNull(false)
  @Unique
  @Column
  name: string;

  @AllowNull(false)
  @Unique
  @Column
  code: string;
}
