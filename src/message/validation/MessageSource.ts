import { IsNotEmpty, IsUrl, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class MessageSourceType {
  @IsString()
  @Transform((v, data) => data.label.trim())
  @IsNotEmpty()
  @MaxLength(50)
  label: string;

  @IsString()
  @Transform((v, data) => data.url.trim())
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
