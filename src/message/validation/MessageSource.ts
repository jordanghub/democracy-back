import { IsNotEmpty, IsUrl, IsString, MaxLength } from 'class-validator';

export class MessageSourceType {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  label: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

}
