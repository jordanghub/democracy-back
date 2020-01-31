import { Table, Column, Model, ForeignKey, DataType, BelongsTo, NotNull, AllowNull } from 'sequelize-typescript';
import { ScoringLabel } from './scoring-label.entity';
import { Message } from 'src/message/message.entity';
import { User } from 'src/users/user.entity';

@Table({
  indexes: [
    {
      unique: true,
      fields: ['scoringCategoryId', 'messageId', 'userId'],
    },
  ],
})
export class Scoring extends Model {

  @AllowNull(false)
  @ForeignKey(() => ScoringLabel)
  @Column
  scoringCategoryId: number;

  @AllowNull(false)
  @ForeignKey(() => Message)
  @Column
  messageId: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column(DataType.INTEGER)
  value: number;

  @BelongsTo(() => ScoringLabel)
  scoringCategory: ScoringLabel;

  @BelongsTo(() => Message)
  message: Message;

}
