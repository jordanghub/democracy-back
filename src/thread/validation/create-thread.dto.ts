import {
  IsNotEmpty,
  ArrayNotEmpty,
  IsNumber,
  MinLength,
  MaxLength,
  ValidateNested,
  IsOptional,
  IsString,
  ValidateIf,
  IsInt,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

import { MessageSourceType } from 'src/message/validation/MessageSource';

export class CreateThreadDto {
  @IsString()
  @Transform(o => o.trim())
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(255)
  title: string;

  @IsString()
  @Transform(o => o.trim())
  @IsNotEmpty()
  @MinLength(10)
  message: string;

  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MessageSourceType)
  sources: MessageSourceType[];

  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  categories: number[];

  @ValidateIf(o => o.selectedText && o.refMessageId)
  @IsNumber()
  refThreadId: number;

  @ValidateIf(o => o.refThreadId && o.refMessageId)
  @IsString()
  @Transform(o => o.trim())
  @IsNotEmpty()
  @MinLength(15)
  @MaxLength(100)
  selectedText: string;

  @ValidateIf(o => o.refThreadId && o.selectedText)
  @IsInt()
  @Min(0)
  refMessageId: number;
}
