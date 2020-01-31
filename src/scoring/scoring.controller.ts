import { Controller, Get, Param, NotFoundException, Post, Req, Body } from '@nestjs/common';
import { ScoringService } from 'src/scoring/scoring.service';

@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Get()
  async getMessageVotes() {
    const scoringCategories = await this.scoringService.getScoringCategories();

    return scoringCategories;
  }
}
