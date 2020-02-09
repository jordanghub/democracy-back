import { BadRequestException } from '@nestjs/common';

export const classValidatorErrorFilter = (errors) => {
  const filteredErrors = errors.map((error) => {
    return {
      property: error.property,
      constraints:  Object.entries(error.constraints).map(cst => cst[0]),
    };
  });
  return new BadRequestException(filteredErrors);
};
