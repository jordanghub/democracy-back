import { Controller, Get, Param, NotFoundException, Post, Req, Body, UseGuards } from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { Scoring } from 'src/scoring/scoring.entity';
import sequelize = require('sequelize');
import { ScoringLabel } from 'src/scoring/scoring-label.entity';
import { Message } from './message.entity';
import { CreateVoteDto } from './validation/create-vote.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/:id/votes/me')
  //@UseGuards(AuthGuard('jwt'))
  async getUserVotes(@Param('id') id, @Req() req) {
    const myVotes = await this.messageService.getMyVotes(2, id);

    return myVotes;
  }


  @Post('/:id/votes')
  @UseGuards(AuthGuard('jwt'))
  // Auth
  async voteForMessage(@Param('id') id, @Req() req, @Body() createScoringDto: CreateVoteDto) {
    await this.messageService.voteMessage(
      createScoringDto.categories,
      req.user.userId,
      id,
    );

    return {};
    //await this.messageService.voteMessage()
  }
  @Get('/:id/votes')
  async getMessageVotes(@Param('id') id) {
    const messageVotes = this.messageService.getMessageVotes(id);

    if (!messageVotes) {
      throw new NotFoundException();
    }

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
    return messageVotes;
  }
}
