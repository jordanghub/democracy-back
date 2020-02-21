import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Validate,
  IsString,
} from 'class-validator';
import { UsernameUnique } from 'src/validators/userUnique';
import { EmailUnique } from 'src/validators/emailUnique';
import { Transform } from 'class-transformer';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Transform(o => o.trim())
  @MinLength(3)
  @MaxLength(12)
  @Validate(UsernameUnique)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Transform(o => o.trim())
  @MinLength(6)
  @MaxLength(24)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Transform(o => o.trim())
  @IsEmail()
  @Validate(EmailUnique)
  email: string;
}
