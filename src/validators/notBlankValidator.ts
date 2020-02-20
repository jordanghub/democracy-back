import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'notBlank' })
export class NotBlank implements ValidatorConstraintInterface {
  validate(str: string) {
    if (!(typeof str === 'string')) {
      return false;
    }
    if (str.trim() === '') {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'the value should not be blank';
  }
}
