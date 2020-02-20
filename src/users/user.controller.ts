import {
  Controller,
  Post,
  Body,
  HttpException,
  UseInterceptors,
  UploadedFiles,
  Options,
  BadRequestException,
  UploadedFile,
  Get,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  Inject,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './validation/create-user.dto';
import { AVATAR_UPLOAD_PATH } from 'src/appConsts/upload';

import { diskStorage } from 'multer';
import { extname } from 'path';
import { EditUserDto } from './validation/edit-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ThreadService } from 'src/thread/thread.service';
import { getPaginationParams } from 'src/utils/sequelize-pagination';
import { formatThreadLatest } from 'src/utils/formatThread';

const avatarFilter = (req, file, cb) => {
  if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException([
        { property: 'avatar', constraints: ['wrongType'] },
      ]),
    );
  }
};

@Controller('users')
export class UserController {
  constructor(
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(ThreadService) private readonly threadService: ThreadService,
  ) {}

  @Get('/me/threads')
  @UseGuards(AuthGuard('jwt'))
  async getUserThreads(@Req() req, @Query('page') page) {
    const result = await this.threadService.findAllCurrentUserThreads(
      req.user.userId,
    );
    const threads = result.rows.map(thread => formatThreadLatest(thread));

    const data = getPaginationParams(threads, result.count, page);
    return data;
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async getUserData(@Req() req) {
    const user = await this.userService.findOneById(req.user.userId);

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Post('/me')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ forbidUnknownValues: true }))
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: AVATAR_UPLOAD_PATH,
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: avatarFilter,
      limits: {
        fileSize: 50000,
        files: 1,
      },
    }),
  )
  async changeUserData(
    @Req() req,
    @UploadedFile() avatar,
    @Body() editUserDto: EditUserDto,
  ) {
    const modifiedUser = await this.userService.editOne(
      req.user.userId,
      editUserDto,
      avatar,
    );

    return {
      id: modifiedUser.id,
      username: modifiedUser.username,
      avatarFileName: modifiedUser.avatarFileName,
      email: modifiedUser.email,
    };
  }
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: AVATAR_UPLOAD_PATH,
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: avatarFilter,
      limits: {
        fileSize: 50000,
        files: 1,
      },
    }),
  )
  @Post('/register')
  async createNewUser(
    @UploadedFile() avatar,
    @Body() createUserDto: CreateUserDto,
  ) {
    const userData: any = {
      username: createUserDto.username,
      password: createUserDto.password,
      email: createUserDto.email,
    };

    if (avatar?.filename) {
      userData.avatarFileName = avatar.filename;
    }

    try {
      const user = await this.userService.createOne(userData);

      if (user) {
        return {
          id: user.id,
          username: user.username,
          email: user.email,
        };
      }
    } catch (err) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
