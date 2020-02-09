import { Table, Column, Model, ForeignKey, DataType, BelongsTo, AllowNull } from 'sequelize-typescript';
import { Thread } from 'src/thread/thread.entity';
import { Message } from './message.entity';

@Table({ underscored: true })
export class MessageSource extends Model {

  @Column(DataType.TEXT)
  url: string;

  @Column(DataType.TEXT)
  label: string;

  @AllowNull(false)
  @ForeignKey(() => Message)
  @Column
  messageId: number;

  @BelongsTo(() => Message)
  message: Message;
}
