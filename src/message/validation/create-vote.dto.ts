import { IsInt, ValidateNested, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ScoringParam } from './ScoringParam';
export class CreateVoteDto {
  @IsInt()
  @Min(0)
  messageId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoringParam)
  categories: ScoringParam[];
}
