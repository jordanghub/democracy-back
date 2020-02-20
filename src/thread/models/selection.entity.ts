import {
  Table,
  Column,
  Model,
  ForeignKey,
  AllowNull,
  BelongsTo,
  Unique,
} from 'sequelize-typescript';
import { Thread } from 'src/thread/models/thread.entity';

@Table({ underscored: true })
export class Selection extends Model {
  @AllowNull(false)
  @ForeignKey(() => Thread)
  @Column
  threadReferencedFromId: number;

  @AllowNull(false)
  @ForeignKey(() => Thread)
  @Column
  threadReferenceToId: number;

  @AllowNull(false)
  @Column
  selectedText: string;

  @BelongsTo(() => Thread, 'threadReferencedFromId')
  thread: Thread;

  @BelongsTo(() => Thread, 'threadReferenceToId')
  referenceThread: Thread;
}
