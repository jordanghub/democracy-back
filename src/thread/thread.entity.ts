import { Table, Column, Model, HasMany, BelongsToMany, HasOne, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Message } from 'src/message/message.entity';
import { ThreadCategory } from 'src/categories/thread-category.entity';
import { User } from 'src/users/user.entity';
import { ThreadRef } from './thread-ref.entity';
import { Selection } from './selection.entity';

@Table({ underscored: true })
export class Thread extends Model {
  @Column
  title: string;

  @Column
  slug: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Selection)
  @Column
  selectionId: number;

  @BelongsTo(() => User)
  author: User;

  @BelongsTo(() => Selection)
  originalSelection: Selection;

  @HasMany(() => Message)
  messages: Message[];

  @HasMany(() => ThreadCategory, 'threadId')
  categories: ThreadCategory[];

  @HasMany(() => ThreadCategory, 'threadId')
  categoriesFilter: ThreadCategory[];
}
