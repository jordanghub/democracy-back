import { IsInt, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ScoringParam } from './ScoringParam';
export class CreateVoteDto {
  @IsInt()
  messageId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoringParam)
  categories: ScoringParam[];
}
