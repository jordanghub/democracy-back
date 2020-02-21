import { IsNotEmpty, IsUrl, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class MessageSourceType {
  @IsString()
  @Transform(o => o.trim())
  @IsNotEmpty()
  @MaxLength(50)
  label: string;

  @IsString()
  @Transform(o => o.trim())
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
