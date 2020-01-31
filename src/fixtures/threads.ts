import { Thread } from 'src/thread/thread.entity';
import { Message } from 'src/message/message.entity';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';
import { ThreadCategory } from 'src/categories/thread-category.entity';
const data = [
  {
    title: 'JE suis un titre1',
    content: 'Je suis un contenu1',
  },
  {
    title: 'JE suis un titre2',
    content: 'Je suis un contenu2',
  },
  {
    title: 'JE suis un titre3',
    content: 'Je suis un contenu3',
  },
  {
    title: 'JE suis un titre4',
    content: 'Je suis un contenu4',
  },
  {
    title: 'JE suis un titre5',
    content: 'Je suis un contenu5',
  },
];

export const createThreads = async () => {

  return new Promise(async (resolve) => {
    const users = await User.findAll();
    const categories =  await Category.findAll();

    const sequelize = Thread.sequelize;
    for(let threadDataId = 0; threadDataId < data.length; threadDataId++) {
      const transaction = await sequelize.transaction();
      try {
        const author = users[Math.floor(Math.random() * users.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];

        let thread = new Thread({
          title: data[threadDataId].title,
          userId: author.id,
        });

        thread = await thread.save({ transaction });

        const threadCategory = new ThreadCategory({
          threadId: thread.id,
          categoryId: category.id,
        });

        await threadCategory.save({ transaction });

        thread.categories = [];

        thread.categories.push(threadCategory);

        const message = new Message({
          content: data[threadDataId].content,
          userId: author.id,
          threadId: thread.id,
        });

        await message.save({ transaction });

        thread.messages = [];

        thread.messages.push(message);

        await thread.save({ transaction });

        await transaction.commit();
      } catch (err) {
        console.log(err);
        await transaction.rollback();
      }
    }
    resolve();
  });
};
