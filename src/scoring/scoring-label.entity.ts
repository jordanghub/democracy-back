import { Table, Column, Model } from 'sequelize-typescript';

@Table({ underscored: true })
export class ScoringLabel extends Model {
  @Column
  name: string;
}
