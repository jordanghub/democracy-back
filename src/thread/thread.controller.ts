import { Controller, UseGuards, Get, Request, Post, Body, BadRequestException, UnauthorizedException, HttpException, Param, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThreadService } from './thread.service';
import { Thread } from './thread.entity';
import { CreateThreadDto } from './create-thread.dto';
import { formatThreadLatest } from 'src/utils/formatThread';
import { Scoring } from 'src/scoring/scoring.entity';
import { ScoringLabel } from 'src/scoring/scoring-label.entity';
import sequelize = require('sequelize');

@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Get('/:id/votes')
  async getThreadVotesAverage(@Param('id') id) {

    const votes = await this.threadService.findMessagesVoteAverage(id);

    if (!votes) {
      throw new NotFoundException();
    }

    return votes;
  }

  @Get('/:id')
  async getOne(@Param('id') id) {
    const thread = await this.threadService.findOne(id);

    if (!thread) {
      throw new NotFoundException();
    }

    // const messageVotes = await Scoring.findAll({
    //   where: {
    //     messageId: thread.messages[0].id,
    //   },
    //   // @ts-ignore
    //   attributes: [
    //     [sequelize.col('scoringCategory.name'), 'category'],
    //     [
    //       sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('value'))),
    //       'average',
    //     ],
    //     [
    //       sequelize.fn('COUNT', sequelize.col('value')),
    //       'voteCount',
    //     ],
    //   ],
    //   include: [
    //     {
    //       model: ScoringLabel,
    //       attributes: [],
    //     },
    //   ],
    //   group: ['scoringCategoryId'],

    // });

    // const messageVotes = await Scoring.findAll({
    //   where: {
    //     messageId: thread.messages[0].id,
    //     scoringCategoryId : 9,
    //   },
    //   attributes: ['id', 'value'],
    //   include: [{
    //     model: ScoringLabel,
    //   }],

    // });

    //return messageVotes;


    return formatThreadLatest(thread);

  }

  @Get()
  async getAllThreads(@Request() req) {

    const threads = await this.threadService.findAll();

    return threads.map((thread) => formatThreadLatest(thread));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createNewThread(@Request() req, @Body() createThreadDto: CreateThreadDto) {
    const thread = await this.threadService.createOne(
      createThreadDto.title,
      createThreadDto.message,
      req.user.userId,
      createThreadDto.categories,
    );

    if (!(thread instanceof Thread)) {
      throw new BadRequestException();
    }

    return thread;
  }
}
