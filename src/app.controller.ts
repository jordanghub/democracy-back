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
import sequelize from 'sequelize';
import { AuthService } from './auth/auth.service';
import { Response as IResponse, Request as IRequest } from 'express';
import { Category } from './categories/models/category.entity';
import { Op } from 'sequelize';
import { Thread } from './thread/models/thread.entity';
import { getPaginationParams, pagination } from './utils/sequelize-pagination';
import { join } from 'path';
import fs from 'fs';
import { EmailService } from './email/email.service';
import { ThreadCategory } from './categories/models/thread-category.entity';
import { User } from './users/models/user.entity';
import { Scoring } from './scoring/scoring.entity';
import { ScoringLabel } from './scoring/models/scoring-label.entity';
import { formatThreadLatest } from './utils/formatThread';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

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
    @Query('full') isFull,
  ) {
    let result = null;

    if (!isFull) {
      result = await Thread.findAndCountAll({
        attributes: ['id', 'title', 'slug'],
        ...pagination({ pageSize: 5, page, distinct: false }),
        where: {
          title: {
            [Op.like]: `%${searchParam}%`,
          },
        },
      });
    } else {
      result = await Thread.findAndCountAll({
        ...pagination({ page, pageSize: 5, distinct: true }),
        where: {
          title: {
            [Op.like]: `%${searchParam}%`,
          },
        },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'title', 'slug', 'createdAt'],
        include: [
          {
            model: ThreadCategory,
            as: 'categories',
            attributes: ['createdAt'],
            include: [
              {
                model: Category,
                attributes: ['id', 'name'],
              },
            ],
          },
          {
            model: User,
            required: true,
            attributes: ['id', 'username', 'avatarFileName'],
          },
          {
            model: Scoring,
            // @ts-ignore
            attributes: [
              // @ts-ignore
              [sequelize.col('scoringCategory.name'), 'category'],
              [
                // @ts-ignore
                sequelize.fn(
                  'ROUND',
                  // @ts-ignore
                  sequelize.fn('AVG', sequelize.col('value')),
                ),
                'average',
              ],
              // @ts-ignore
              [sequelize.fn('COUNT', sequelize.col('value')), 'voteCount'],
            ],
            separate: true,
            include: [
              {
                model: ScoringLabel,
                attributes: [],
              },
            ],
            // @ts-ignore
            group: ['threadId', 'scoringCategory.id'],
          },
        ],
      });
    }

    const data = getPaginationParams(
      result.rows.map(thread => formatThreadLatest(thread)),
      result.count,
      page,
      5,
    );
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
