import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from 'src/users/models/user.entity';

@ValidatorConstraint({ name: 'uniqueUsername', async: true })
export class UsernameUnique implements ValidatorConstraintInterface {
  async validate(username: string) {
    try {
      const user = await User.findOne({
        where: {
          username,
        },
      });

      return user ? false : true;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'username is already taken';
  }
}
