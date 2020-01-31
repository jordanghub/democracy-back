import { IsEmail, IsNotEmpty, IsArray, IsNumberString, ArrayNotEmpty, IsNumber, MinLength, MaxLength } from 'class-validator';
export class CreateThreadDto {
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @MinLength(10)
  message: string;

  @ArrayNotEmpty()
  @IsNumber({}, {each: true})
  categories: number[];
}
