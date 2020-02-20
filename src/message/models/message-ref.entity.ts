import {
  Table,
  Column,
  Model,
  ForeignKey,
  AllowNull,
  Unique,
  BelongsTo,
} from 'sequelize-typescript';
import { Message } from './message.entity';
import { Selection } from 'src/thread/models/selection.entity';
import { Thread } from 'src/thread/models/thread.entity';

@Table({ underscored: true })
export class MessageRef extends Model {
  @AllowNull(false)
  @ForeignKey(() => Message)
  @Column
  messageId: number;

  @AllowNull(false)
  @ForeignKey(() => Thread)
  @Column
  threadReferenceToId: number;

  @AllowNull(false)
  @ForeignKey(() => Selection)
  @Column
  selectionId: number;

  @BelongsTo(() => Selection)
  selectedItem: Selection;
}
