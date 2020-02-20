import { Category } from 'src/categories/models/category.entity';

const data = [
  {
    name: 'Politique',
  },
  {
    name: 'Environnement',
  },
  {
    name: 'Social',
  },
  {
    name: 'Economie',
  },
  {
    name: 'Médecine',
  },
  {
    name: 'Travail',
  },
  {
    name: 'Culture',
  },
  {
    name: 'Internet',
  },
];

export const createCategory = () => {
  return new Promise(async (resolve, reject) => {
    for (let catData = 0; catData < data.length; catData++) {
      const user = new Category(data[catData]);
      await user.save();
    }
    resolve();
  });
};
