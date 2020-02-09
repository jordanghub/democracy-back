import { Table, Column, Model, ForeignKey, AllowNull, Unique, BelongsTo, PrimaryKey } from 'sequelize-typescript';
import { Thread } from 'src/thread/thread.entity';
import { Selection } from './selection.entity';

@Table({ underscored: true })
export class ThreadRef extends Model {
  @AllowNull(false)
  @Unique
  @PrimaryKey
  @ForeignKey(() => Thread)
  @Column
  id: number;

  @AllowNull(false)
  @ForeignKey(() => Selection)
  @Column
  selectionId: number;

}
