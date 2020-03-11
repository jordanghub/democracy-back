import { Injectable, Inject } from '@nestjs/common';
import { SCORING_LABEL_REPOSITORY } from 'src/appConsts/sequelizeRepository';
import { ScoringLabel } from 'src/scoring/models/scoring-label.entity';

@Injectable()
export class ScoringService {
  constructor(
    @Inject(SCORING_LABEL_REPOSITORY)
    private readonly scoringLabelRepository: typeof ScoringLabel,
  ) {}

  getScoringCategories() {
    return this.scoringLabelRepository.findAll({
      attributes: ['id', 'name'],
    });
  }
}
