import { Injectable, Inject } from '@nestjs/common';
import { THREAD_REPOSITORY } from 'src/appConsts/sequelizeRepository';
import { Thread } from 'src/thread/thread.entity';
import { Message } from 'src/message/message.entity';
import { User } from 'src/users/user.entity';
import { ThreadCategory } from 'src/categories/thread-category.entity';
import { Category } from 'src/categories/category.entity';
import { Scoring } from 'src/scoring/scoring.entity';
import sequelize = require('sequelize');
import { ScoringLabel } from 'src/scoring/scoring-label.entity';

@Injectable()
export class ThreadService {
  constructor(
    @Inject(THREAD_REPOSITORY) private readonly threadRepository: typeof Thread,
  ) {}

  async findMessagesVoteAverage(id) {
    return Scoring.findAll({
      // @ts-ignore
      attributes: [
        [sequelize.col('scoringCategory.name'), 'category'],
        [
          sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('value'))),
          'average',
        ],
        [
          sequelize.fn('COUNT', sequelize.col('value')),
          'voteCount',
        ],
      ],
      include: [
        {
          model: ScoringLabel,
          attributes: [],
        },
        {
          model: Message,
          where: {
            threadId: id,
          }
        }
      ],
      group: ['scoringCategoryId'],
    });
  }

  async findAll(): Promise<Thread[]> {
    return this.threadRepository.findAll<Thread>({
      order: [
        ['createdAt', 'DESC'],
      ],
      attributes: ['id', 'title', 'slug', 'createdAt'],
      include: [
        {
          model: Message,
          attributes: ['id', 'content', 'createdAt'],
        },
        {
          model: ThreadCategory,
          attributes: ['createdAt'],
          include: [{
            model: Category,
            attributes: ['id', 'name'],
          }],
        },
        {
          model: User,
          attributes: ['id', 'username'],
        },
    ],
    });
  }

  async findOne(id: string): Promise<Thread> {
    return this.threadRepository.findOne<Thread>({
      where: {
        id,
      },
      attributes: ['id', 'title', 'slug', 'createdAt'],
      include: [
        {
          model: Message,
          attributes: ['id', 'content', 'createdAt'],
          include: [
            {
              model: User,
              attributes: ['id', 'username']
            }
          ]
        },
        {
          model: ThreadCategory,
          attributes: ['createdAt'],
          include: [{
            model: Category,
            attributes: ['id', 'name'],
          }],
        },
        {
          model: User,
          attributes: ['id', 'username'],
        },
      ],
    });
  }

  async createOne(title: string, message: string, authorId: string , categories: number[]) {

    const sequelize = this.threadRepository.sequelize;
    const transaction = await sequelize.transaction();

    try {
      const authorEntity = await User.findOne({
        where: {
          id: authorId,
        },
      });

      if (!authorEntity) {
        throw new Error('user not found');
      }
      const thread = new this.threadRepository({
        title,
        userId: authorEntity.id,
      });

      await thread.save({ transaction });

      // Fetch the list of the categories

      let categoriesEntity = await Promise.all(categories.map((catId) => {
        return Category.findOne({
          where: {
            id: catId,
          },
        });
      }));

      // Filter null if some cat doesn't exist

      categoriesEntity = categoriesEntity.filter((el) => el !== null);

      for (const cat of categoriesEntity) {
        const threadCat = new ThreadCategory({
          threadId: thread.id,
          categoryId: cat.id,
        });
        await threadCat.save({ transaction });
      }

      // Create the first thread message

      const threadMessage = new Message({
        threadId: thread.id,
        content: message,
        userId: authorEntity.id,
      });

      // Save the message

      await threadMessage.save({ transaction });

      // Commit
      await transaction.commit();

      return this.findOne(thread.id);

    } catch (err) {
      console.log(err);
      // Rollback if errors
      await transaction.rollback();
    }
  }
}
