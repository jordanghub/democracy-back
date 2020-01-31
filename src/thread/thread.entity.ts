import { Table, Column, Model, HasMany, BelongsToMany, HasOne, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Message } from 'src/message/message.entity';
import { ThreadCategory } from 'src/categories/thread-category.entity';
import { User } from 'src/users/user.entity';

@Table
export class Thread extends Model {
  @Column
  title: string;

  @Column
  slug: string;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  author: User;

  @HasMany(() => Message)
  messages: Message[];

  @HasMany(() => ThreadCategory)
  categories: ThreadCategory[];
}
