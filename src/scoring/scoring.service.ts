import { Injectable, Inject } from '@nestjs/common';
import { SCORING_LABEL_REPOSITORY, SCORING_REPOSITORY } from 'src/appConsts/sequelizeRepository';
import { Scoring } from 'src/scoring/scoring.entity';
import { ScoringLabel } from 'src/scoring/scoring-label.entity';

@Injectable()
export class ScoringService {
  constructor(
    @Inject(SCORING_LABEL_REPOSITORY) private readonly scoringLabelRepository: typeof ScoringLabel,
    @Inject(SCORING_REPOSITORY) private readonly scoringRepository: typeof Scoring,
  ) {}

  getScoringCategories() {
    return ScoringLabel.findAll({
      attributes: ['id', 'name'],
    });
  }
}
