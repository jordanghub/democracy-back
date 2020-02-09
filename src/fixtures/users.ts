import { User } from 'src/users/user.entity';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/appConsts/bcrypt';

const data = [
  {
    username: 'jordan',
    password: 'unpetittest',
    email: 'test@test.fr',
  },
  {
    username: 'test',
    password: 'unpetittest',
    email: 'test2@test.fr',
  },
  {
    username: 'testeur',
    password: 'lfkhdsflkdjsh',
    email: 'test3@test.fr',
  },
  {
    username: 'wouhou',
    password: 'dsjlfkhdsflkdjsh',
    email: 'test4@test.fr',
  },
  {
    username: 'bernard',
    password: 'jlfkhdsflkdjsh',
    email: 'test5@test.fr',
  },
  {
    username: 'jean',
    password: 'dsjlkhdsflkdjsh',
    email: 'test6@test.fr',
  },
  {
    username: 'albert',
    password: 'lfkhsflkdjsh',
    email: 'test7@test.fr',
  },
  {
    username: 'machin',
    password: 'tdhhjkl',
    email: 'test8@test.fr',
  },
  {
    username: 'zoubizoub',
    password: 'test',
    email: 'test9@test.fr',
  },
];

export const createUsers = () => {
  return new Promise(async (resolve, reject) => {
    for(let userData = 0; userData < data.length; userData++) {
      const hashedPassword = await bcrypt.hash(data[userData].password, SALT_ROUNDS);
      const user = new User({
        ...data[userData],
        password: hashedPassword,
      });
      await user.save();
    }
    resolve();
  });
};
