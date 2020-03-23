import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  forwardRef,
} from '@nestjs/common';
import { User } from './models/user.entity';
import { USER_REPOSITORY } from 'src/appConsts/sequelizeRepository';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/appConsts/bcrypt';
import { Role } from './models/role.entity';
import { UserRole } from './models/user-roles.entity';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
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

  async verifyEmail({ token }) {
    if (!token) {
      throw new BadRequestException({ type: 'invalid_token' });
    }
    const user = await User.findOne({
      where: {
        validationToken: token,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    if (user.isActivated) {
      throw new BadRequestException({ type: 'already_active' });
    }

    try {
      await this.jwtService.verifyAsync(user.validationToken);

      user.isActivated = true;
      user.validationToken = null;

      await user.save();
    } catch (e) {
      throw new BadRequestException({ type: 'token_expired' });
    }
  }

  async resendValidationEmail(username: string, password: string) {
    if (!username || !password) {
      throw new BadRequestException();
    }

    const user = await this.authService.validateUser(username, password, false);

    if (!user) {
      throw new BadRequestException();
    }
    const payload = { userId: user.id };

    const newToken = this.jwtService.sign(payload);

    user.validationToken = newToken;
    await user.save();

    await this.emailService.registerConfirmationEmail(user);
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

    const verificationTokenPayload = { username: user.username, sub: user.id };

    user.validationToken = this.jwtService.sign(verificationTokenPayload);
    await user.save();

    const userRole = new UserRole({
      userId: roleUser.id,
      roleId: roleUser.id,
    });

    await userRole.save();

    await this.emailService.registerConfirmationEmail(user);

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
