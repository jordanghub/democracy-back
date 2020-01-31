import { Thread } from 'src/thread/thread.entity';
import { Category } from 'src/categories/category.entity';

import { BelongsTo, Table, Column, ForeignKey, Model, HasOne } from 'sequelize-typescript';

@Table
export class ThreadCategory extends Model {
  @ForeignKey(() => Thread)
  @Column
  threadId: number;

  @ForeignKey(() => Category)
  @Column
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

}
