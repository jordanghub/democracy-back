import {
  ValidateNested,
  IsString,
  ArrayNotEmpty,
  IsOptional,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { MessageSourceType } from './MessageSource';
export class MessageType {
  @IsString()
  @Transform((v, data) => data.content.trim())
  @MinLength(10)
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MessageSourceType)
  sources: MessageSourceType[];
}
