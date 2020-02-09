import { Controller, Request, Post, UseGuards, Get, Response, UnauthorizedException, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { Response as IResponse, Request as IRequest } from 'express';
import { Category } from './categories/category.entity';
import { Op } from 'sequelize';
import { Thread } from './thread/thread.entity';
import { getPaginationParams, pagination } from './utils/sequelize-pagination';


@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req, @Response() res: IResponse) {
    const token = await this.authService.login(req.user);
    if (token.access_token) {
      res.cookie('token', token.access_token, { httpOnly: true, domain: '127.0.0.1' });
      res.cookie('refresh_token', token.refresh_token, { httpOnly: true, domain: '127.0.0.1' });
      res.send(token);
    }
    return token;
  }

  @Get('/search/threads')
  async search(@Request() req, @Query('page') page, @Query('search') searchParam) {

    const sequelize = Category.sequelize;

    const result = await Thread.findAndCountAll({
      attributes: ['id', 'title'],
      ...pagination({ pageSize: 5, page, distinct: false}),
      where: {
        title:  {
          [Op.like]: `%${searchParam}%`,
        },
      },
    });

    const data = getPaginationParams(result.rows, result.count, page, 5);
    return data;

  }
  @Post('auth/refresh')
  async refresh(@Request() req: IRequest, @Response() res: IResponse) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    try {
      const token = await this.authService.refresh(refreshToken);
      if (token.access_token) {
        res.cookie('token', token.access_token, { httpOnly: true, domain: '127.0.0.1' });
        res.send(token);
      }
      return token;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        const date = new Date(0);
        res.cookie('refresh_token', '', { expires: new Date(0)});
        res.cookie('token', '', {expires: new Date(0)});
      }
      throw err;
    }
  }
}
