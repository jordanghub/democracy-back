import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Req,
  Body,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { CreateVoteDto } from './validation/create-vote.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('messages')
export class MessageController {
  constructor(
    @Inject(MessageService) private readonly messageService: MessageService,
  ) {}

  @Get('/:id/votes/me')
  @UseGuards(AuthGuard('jwt'))
  async getUserVotes(@Param('id') id, @Req() req) {
    const myVotes = await this.messageService.getMyVotes(req.user.userId, id);

    return myVotes;
  }

  @Post('/:id/votes')
  @UseGuards(AuthGuard('jwt'))
  async voteForMessage(
    @Param('id') id,
    @Req() req,
    @Body() createScoringDto: CreateVoteDto,
  ) {
    await this.messageService.voteMessage(
      createScoringDto.categories,
      req.user.userId,
      id,
    );

    return {};
  }
  @Get('/:id/votes')
  async getMessageVotes(@Param('id') id) {
    const messageVotes = this.messageService.getMessageVotes(id);

    if (!messageVotes) {
      throw new NotFoundException();
    }
    return messageVotes;
  }
}
