import { Category } from 'src/categories/models/category.entity';
import { Role } from 'src/users/models/role.entity';

const data = [
  {
    name: 'Utilisateur',
    code: 'ROLE_USER',
  },
  {
    name: 'Administrateur',
    code: 'ROLE_ADMIN',
  },
  {
    name: 'Modérateur',
    code: 'ROLE_MODERATOR',
  },
];

export const createRoles = () => {
  return new Promise(async (resolve, reject) => {
    for (let catData = 0; catData < data.length; catData++) {
      const role = new Role(data[catData]);
      await role.save();
    }
    resolve();
  });
};
