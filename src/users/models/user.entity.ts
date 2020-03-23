import {
  Table,
  Column,
  Model,
  ForeignKey,
  Unique,
  DataType,
  HasMany,
  AllowNull,
  Default,
} from 'sequelize-typescript';
import { Thread } from 'src/thread/models/thread.entity';
import { Message } from 'src/message/models/message.entity';
import { UserRole } from './user-roles.entity';

@Table({ underscored: true })
export class User extends Model {
  @Unique
  @Column(DataType.STRING)
  username: string;

  @Column(DataType.STRING)
  password: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  avatarFileName: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  validationToken: string;

  @Unique
  @Column(DataType.STRING)
  email: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isActivated: boolean;

  @HasMany(() => Thread)
  threads: Thread[];

  @HasMany(() => Message)
  messages: Message[];

  @HasMany(() => UserRole)
  roles: UserRole[];
}
