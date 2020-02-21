import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Validate,
  IsOptional,
  ValidateIf,
  IsString,
} from 'class-validator';
import { EmailUnique } from 'src/validators/emailUnique';
import { Transform } from 'class-transformer';
export class EditUserDto {
  @ValidateIf(o => o.newPassword)
  @IsString()
  @Transform(o => o.trim())
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(24)
  password: string;

  @ValidateIf(o => o.password)
  @IsString()
  @Transform(o => o.trim())
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(24)
  newPassword: string;

  @IsOptional()
  @IsString()
  @Transform(o => o.trim())
  @IsNotEmpty()
  @IsEmail()
  @Validate(EmailUnique)
  email: string;
}
