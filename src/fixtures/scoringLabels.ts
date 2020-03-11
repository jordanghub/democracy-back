import { Category } from 'src/categories/models/category.entity';
import { ScoringLabel } from 'src/scoring/models/scoring-label.entity';

const data = [
  /*
  {
    name: 'Sincerité',
  },
  {
    name: 'Honnêteté',
  },
  {
    name: 'Hypocrisie',
  },
  {
    name: 'Sagesse',
  },
  {
    name: 'Sources',
  },
  */
  {
    name: 'Arguments',
  },
  {
    name: 'Agressivité',
  },
  {
    name: 'Colère',
  },
  {
    name: 'Manipulation',
  },
  {
    name: 'Mensonge',
  },
];

export const createScoringLabels = () => {
  return new Promise(async (resolve, reject) => {
    for (const scoringLabel of data) {
      const user = new ScoringLabel(scoringLabel);
      await user.save();
    }
    resolve();
  });
};
