import { createParamDecorator, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const UserInfo = createParamDecorator((data, req) => {
  return req.user;
});

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // no error is thrown if no user is found
    // You can use info for logging (e.g. token is expired etc.)
    // e.g.: if (info instanceof TokenExpiredError) ...
    return user;
  }
}
