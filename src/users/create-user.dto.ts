import { IsEmail, IsNotEmpty, MinLength, MaxLength, Validate } from 'class-validator';
import { UsernameUnique } from 'src/validators/userUnique';
import { EmailUnique } from 'src/validators/emailUnique';
export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(12)
  @Validate(UsernameUnique)
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(24)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(EmailUnique)
  email: string;

}
