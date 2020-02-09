import {
  Controller,
  UseGuards,
  Get,
  Request,
  Post,
  Body,
  BadRequestException,
  Param,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThreadService } from './thread.service';
import { Thread } from './thread.entity';
import { CreateThreadDto } from './create-thread.dto';
import { formatThreadLatest } from 'src/utils/formatThread';
import { MessageType } from 'src/message/validation/MessageType';
import { getPaginationParams } from 'src/utils/sequelize-pagination';

@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Post('/:id/answer')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ forbidUnknownValues: true}))
  async answerToMessage(@Param('id') id, @Request() req,  @Body() messageDto: MessageType) {

    const message = await this.threadService.answerToThread(
      req.user.userId,
      id,
      messageDto.content,
      messageDto.sources || [],
    );

    return message;
  }

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
    return formatThreadLatest(thread);

  }
  @Get()
  async getAllThreads(@Request() req, @Query('page') page ) {
    const result = await this.threadService.findAll(page);

    const threads = result.rows.map((thread) => formatThreadLatest(thread));

    const data = getPaginationParams(threads, result.count, page);
    return data;
  }

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ forbidUnknownValues: true, disableErrorMessages: true }))
  @Post()
  async createNewThread(@Request() req, @Body() createThreadDto: CreateThreadDto) {
    const thread = await this.threadService.createOne(
      createThreadDto.title,
      createThreadDto.message,
      req.user.userId,
      createThreadDto.categories,
      createThreadDto.sources || [],
      createThreadDto.refThreadId || null,
      createThreadDto.selectedText || null,
      createThreadDto.refMessageId || null,
    );

    if (!(thread instanceof Thread)) {
      throw new BadRequestException();
    }

    return thread;
  }
}
