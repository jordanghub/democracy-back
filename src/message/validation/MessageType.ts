import {  ValidateNested, IsString, ArrayNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageSourceType } from './MessageSource';
export class MessageType {

  @IsString()
  content: string;

  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MessageSourceType)
  sources: MessageSourceType[];
}
