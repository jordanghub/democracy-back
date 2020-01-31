import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class ScoringLabel extends Model {
  @Column
  name: string;
}
