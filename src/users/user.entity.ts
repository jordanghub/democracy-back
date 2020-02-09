import { Table, Column, Model, ForeignKey, Unique, DataType, HasMany } from 'sequelize-typescript';
import { Thread } from 'src/thread/thread.entity';
import { Message } from 'src/message/message.entity';

@Table({ underscored: true })
export class User extends Model {

  @Unique
  @Column(DataType.STRING)
  username: string;

  @Column(DataType.STRING)
  password: string;

  @Unique
  @Column(DataType.STRING)
  email: string;

  @HasMany(() => Thread)
  threads: Thread[];

  @HasMany(() => Message)
  messages: Message[];

}
