import {
  Table,
  Column,
  Model,
  HasMany,
  BelongsToMany,
  HasOne,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Message } from 'src/message/models/message.entity';
import { ThreadCategory } from 'src/categories/models/thread-category.entity';
import { User } from 'src/users/models/user.entity';
import { Selection } from './selection.entity';
import { ThreadFollowers } from './thread-followers.entity';

@Table({ underscored: true })
export class Thread extends Model {
  @Column
  title: string;

  @Column
  slug: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  author: User;

  @HasMany(() => Message)
  messages: Message[];

  @HasOne(() => Selection, 'threadReferenceToId')
  originalSelection: Selection;

  @HasMany(() => ThreadCategory)
  categories: ThreadCategory[];

  @HasMany(() => ThreadCategory, 'threadId')
  categoriesFilter: ThreadCategory[];

  @HasMany(() => ThreadFollowers)
  followers: ThreadFollowers[];
}
