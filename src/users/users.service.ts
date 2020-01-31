import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { USER_REPOSITORY } from 'src/appConsts/sequelizeRepository';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/appConsts/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }
  async createOne(username: string, password: string, email: string) {

    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new this.userRepository({
      username,
      password: hashPassword,
      email,
    });

    return user.save();
  }
}
