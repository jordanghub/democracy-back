import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
  NotNull,
  AllowNull,
} from 'sequelize-typescript';
import { ScoringLabel } from './models/scoring-label.entity';
import { Message } from 'src/message/models/message.entity';
import { User } from 'src/users/models/user.entity';
import { Thread } from 'src/thread/models/thread.entity';

@Table({
  indexes: [
    {
      unique: true,
      fields: ['scoring_category_id', 'message_id', 'user_id'],
    },
  ],
  underscored: true,
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

  @ForeignKey(() => Thread)
  @Column
  threadId: number;

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
