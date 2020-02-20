import { Thread } from 'src/thread/models/thread.entity';
import { Category } from 'src/categories/models/category.entity';

import {
  BelongsTo,
  Table,
  Column,
  ForeignKey,
  Model,
  HasOne,
} from 'sequelize-typescript';

@Table({ underscored: true })
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
