import { Table, Column, Model, ForeignKey, HasMany } from 'sequelize-typescript';
import { User } from 'src/users/user.entity';
import { Scoring } from './scoring.entity';
import { Message } from 'src/message/message.entity';

@Table({
  indexes: [
    {
      unique: true,
      fields: ['messageId', 'userId'],
    },
  ],
})
export class ThreadMessageScoring extends Model {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Message)
  @Column
  messageId: number;

  @HasMany(() => Scoring)
  scoringValues: Scoring[];
}
