import {
  SCORING_LABEL_REPOSITORY,
  SCORING_REPOSITORY,
} from 'src/appConsts/sequelizeRepository';
import { ScoringLabel } from './models/scoring-label.entity';
import { Scoring } from './scoring.entity';

export const scoringProviders = [
  {
    provide: SCORING_LABEL_REPOSITORY,
    useValue: ScoringLabel,
  },
  {
    provide: SCORING_REPOSITORY,
    useValue: Scoring,
  },
];
