import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from 'src/users/models/user.entity';

@ValidatorConstraint({ name: 'uniqueEmail', async: true })
export class EmailUnique implements ValidatorConstraintInterface {
  async validate(email: string) {
    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });

      return user ? false : true;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'email is already taken';
  }
}
