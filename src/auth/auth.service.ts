import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import bcrypt from 'bcrypt';
import { User } from 'src/users/models/user.entity';
import { UserTokens } from 'src/users/models/user-tokens.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user) {
      const passwordMatch = await bcrypt.compare(pass, user.password);
      if (passwordMatch) {
        return user;
      }
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    const refreshToken = this.jwtService.sign({}, { expiresIn: '14d' });
    const token = this.jwtService.sign(payload);

    const userTokenEntity = new UserTokens({
      userId: user.id,
      refreshToken,
    });

    await userTokenEntity.save();

    return {
      access_token: token,
      refresh_token: refreshToken,
    };
  }

  async refresh(refreshToken) {
    const userToken = await UserTokens.findOne({
      where: {
        refreshToken,
      },
    });

    if (!userToken) {
      throw new UnauthorizedException();
    }

    const isValid = await this.jwtService.verifyAsync(userToken.refreshToken);

    if (!isValid) {
      await userToken.destroy();
      throw new UnauthorizedException();
    }

    const user = await User.findOne({
      where: {
        id: userToken.userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
