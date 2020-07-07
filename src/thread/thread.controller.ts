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
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThreadService } from './thread.service';
import { Thread } from './models/thread.entity';
import { CreateThreadDto } from './validation/create-thread.dto';
import { formatThreadLatest } from 'src/utils/formatThread';
import { MessageType } from 'src/message/validation/MessageType';
import { getPaginationParams } from 'src/utils/sequelize-pagination';
import { ThreadLockDto } from './validation/thread-lock.dto';
import { WebSocketGatewayServer } from 'src/sockets/gateway';
import { AnonymousStrategy } from 'src/auth/AnonymousPassportStrategy';
import { NotificationService } from 'src/notification/notification.service';

@Controller('threads')
export class ThreadController {
  constructor(
    @Inject(ThreadService) private readonly threadService: ThreadService,
    private wsServer: WebSocketGatewayServer,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Lock a thread (admin only)
   * @param id
   * @param req
   * @param lockData
   */

  @Post('/:id/toggle-lock')
  @UseGuards(AuthGuard('jwt'))
  async lockThread(
    @Param('id') id,
    @Request() req,
    @Body() lockData: ThreadLockDto,
  ) {
    await this.threadService.lockThread(req.user.userId, id, lockData);
  }

  /**
   * Reply to a thread
   * @param id
   * @param req
   * @param messageDto
   */

  @Post('/:id/answer')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ forbidUnknownValues: true }))
  async answerToMessage(
    @Param('id') id,
    @Request() req,
    @Body() messageDto: MessageType,
  ) {
    const message = await this.threadService.answerToThread(
      req.user.userId,
      id,
      messageDto.content,
      messageDto.sources || [],
    );
    try {
      this.wsServer.server.emit(
        `newThreadMessage-${message.threadId}`,
        message,
      );
    } catch (err) {}

    // Future notification service

    try {
      if (message) {
        this.notificationService.threadMessageNotification(message);
      }
    } catch (err) {}

    return message;
  }

  /**
   * Get the thread votes
   * @param id
   */

  @Get('/:id/votes')
  async getThreadVotesAverage(@Param('id') id) {
    const votes = await this.threadService.findMessagesVoteAverage(id);

    if (!votes) {
      throw new NotFoundException();
    }

    return votes;
  }

  /**
   * Follow or unfollow a thread (notifications)
   * @param req
   * @param id
   */
  @Post('/:id/toggle-follow')
  @UseGuards(AuthGuard('jwt'))
  async followThread(@Request() req, @Param('id') id) {
    const result = await this.threadService.toggleThreadFollow(
      id,
      req.user.userId,
    );

    return {
      status: result,
    };
  }

  /**
   * Get a single thread
   * @param id
   */

  @Get('/:id')
  async getOne(@Param('id') id) {
    const thread = await this.threadService.findOne(id);

    if (!thread) {
      throw new NotFoundException();
    }
    return formatThreadLatest(thread);
  }

  /**
   * Get all threads with pagination
   * @param req
   * @param page
   */
  @UseGuards(AuthGuard(['jwt', 'anonymous']))
  @Get()
  async getAllThreads(@Request() req, @Query('page') page) {
    const result = await this.threadService.findAll(
      page,
      5,
      req.user?.userId || null,
    );

    const threads = result.rows.map(thread => formatThreadLatest(thread));

    const data = getPaginationParams(threads, result.count, page);
    return data;
  }

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      disableErrorMessages: true,
    }),
  )

  /**
   * Create a thread
   */
  @Post()
  async createNewThread(
    @Request() req,
    @Body() createThreadDto: CreateThreadDto,
  ) {
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
