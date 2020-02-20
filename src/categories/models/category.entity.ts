import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsToMany,
  Unique,
} from 'sequelize-typescript';
import { Thread } from 'src/thread/models/thread.entity';
import { ThreadCategory } from './thread-category.entity';
@Table({ underscored: true })
export class Category extends Model {
  @Unique
  @Column
  name: string;

  @BelongsToMany(
    () => Thread,
    () => ThreadCategory,
  )
  threads: Thread[];
}
