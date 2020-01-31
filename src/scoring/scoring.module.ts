import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ScoringController } from './scoring.controller';
import { scoringProviders } from './scoring.providers';
import { ScoringService } from './scoring.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ScoringController],
  providers: [
    ScoringService,
    ...scoringProviders,
  ],
})
export class ScoringModule {}
