import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Response,
  UnauthorizedException,
  Query,
  Param,
  Res,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { Response as IResponse, Request as IRequest } from 'express';
import { Category } from './categories/models/category.entity';
import { Op } from 'sequelize';
import { Thread } from './thread/models/thread.entity';
import { getPaginationParams, pagination } from './utils/sequelize-pagination';
import { join } from 'path';
import fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('/search/threads')
  async search(
    @Request() req,
    @Query('page') page,
    @Query('search') searchParam,
  ) {
    const result = await Thread.findAndCountAll({
      attributes: ['id', 'title'],
      ...pagination({ pageSize: 5, page, distinct: false }),
      where: {
        title: {
          [Op.like]: `%${searchParam}%`,
        },
      },
    });

    const data = getPaginationParams(result.rows, result.count, page, 5);
    return data;
  }
  @Post('auth/refresh')
  async refresh(@Body() body) {
    const { refresh_token } = body;

    if (!refresh_token) {
      throw new UnauthorizedException();
    }

    try {
      const token = await this.authService.refresh(refresh_token);
      if (token.access_token) {
        return token;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('avatars/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
    const fileDir = join(__dirname, '..', 'public', 'uploads', 'avatar');
    try {
      const fileExists = await new Promise((resolve, reject) => {
        fs.access(join(fileDir, fileId), err => {
          if (err) {
            reject(new Error());
          } else {
            resolve(true);
          }
        });
      });
      if (fileExists) {
        return res.sendFile(fileId, { root: fileDir });
      }
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
