import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User } from './models/user.entity';
import { USER_REPOSITORY } from 'src/appConsts/sequelizeRepository';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/appConsts/bcrypt';
import { Role } from './models/role.entity';
import { UserRole } from './models/user-roles.entity';

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

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        id,
      },
      attributes: ['id', 'username', 'avatarFileName', 'email'],
      include: [
        {
          model: UserRole,
          attributes: ['id'],

          include: [
            {
              model: Role,
              attributes: ['name', 'code'],
            },
          ],
        },
      ],
    });
  }
  async createOne({ username, password, email, avatarFileName }) {
    const roleUser = await Role.findOne({
      where: {
        code: 'ROLE_USER',
      },
    });
    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const userOpts: any = {
      username,
      password: hashPassword,
      email,
    };

    if (avatarFileName) {
      userOpts.avatarFileName = avatarFileName;
    }
    const user = new this.userRepository(userOpts);
    await user.save();

    const userRole = new UserRole({
      userId: roleUser.id,
      roleId: roleUser.id,
    });
    await userRole.save();
    return user;
  }

  async editOne(id, { newPassword, password, email }, avatar = null) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    if (newPassword && password) {
      const passwordMatchCurrent = await bcrypt.compare(
        password,
        user.password,
      );

      if (!passwordMatchCurrent) {
        throw new BadRequestException([
          { property: 'password', constraints: ['passwordDoesntMatch'] },
        ]);
      }
      const newHashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      user.password = newHashedPassword;
    }

    if (email && user.email !== email) {
      user.email = email;
    }

    if (avatar) {
      user.avatarFileName = avatar.filename;
    }

    await user.save();

    return user;
  }
}
