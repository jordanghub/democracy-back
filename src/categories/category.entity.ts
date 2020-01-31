import { Table, Column, Model, ForeignKey, BelongsToMany, Unique } from 'sequelize-typescript';
import { Thread } from 'src/thread/thread.entity';
import { ThreadCategory } from './thread-category.entity';
@Table
export class Category extends Model {
  @Unique
  @Column
  name: string;

  @BelongsToMany(() => Thread, () => ThreadCategory)
  threads: Thread[];
}
