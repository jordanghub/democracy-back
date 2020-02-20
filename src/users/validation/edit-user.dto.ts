import { IsEmail, IsNotEmpty, MinLength, MaxLength, Validate, IsOptional, ValidateIf } from 'class-validator';
import { EmailUnique } from 'src/validators/emailUnique';
export class EditUserDto {
  @ValidateIf(o => o.newPassword)
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(24)
  password: string;

  @ValidateIf(o => o.password)
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(24)
  newPassword: string;

  @IsOptional()
  @IsEmail()
  @Validate(EmailUnique)
  email: string;
}
