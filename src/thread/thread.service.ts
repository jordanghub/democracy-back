import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { THREAD_REPOSITORY } from 'src/appConsts/sequelizeRepository';
import { Thread } from 'src/thread/thread.entity';
import { Message } from 'src/message/message.entity';
import { User } from 'src/users/user.entity';
import { ThreadCategory } from 'src/categories/thread-category.entity';
import { Category } from 'src/categories/category.entity';
import { Scoring } from 'src/scoring/scoring.entity';
import sequelize = require('sequelize');
import { ScoringLabel } from 'src/scoring/scoring-label.entity';
import { MessageSource } from 'src/message/message-source.entity';
import { MessageService } from 'src/message/message.service';
import { WebSocketGatewayServer } from 'src/sockets/gateway';
import { Selection } from './selection.entity';
import { MessageRef } from 'src/message/message-ref.entity';
import { pagination } from 'src/utils/sequelize-pagination';

@Injectable()
export class ThreadService {
  constructor(
    @Inject(THREAD_REPOSITORY) private readonly threadRepository: typeof Thread,
    @Inject(MessageService) private readonly messageService,
    @Inject(WebSocketGatewayServer) private readonly wsServer: WebSocketGatewayServer,
  ) {}

  async answerToThread(userId, threadId, content, sources) {
    const sequelize = this.threadRepository.sequelize;

    const transaction = await sequelize.transaction();

    try {

      const messageEntity = new Message({
        threadId,
        userId,
        content,
      });

      await messageEntity.save();

      for (const source of sources) {
        const sourceEntity = new MessageSource({
          messageId: messageEntity.id,
          label: source.label,
          url: source.url,
        });
        await sourceEntity.save();
      }

      await transaction.commit();

      const message = await this.messageService.findOne(messageEntity.id);

      this.wsServer.server.emit(`newThreadMessage-${threadId}`, message);

      return message;

    } catch (err) {
      await transaction.rollback();
    }
  }

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
          },
        },
      ],
      group: ['scoring_category_id'],
    });
  }

  async findAll(page: number = 1, pageSize: number = 5) {
    const threads =  this.threadRepository.findAndCountAll({
      ...pagination({ page, pageSize }),
      order: [
        ['createdAt', 'DESC'],
      ],
      attributes: ['id', 'title', 'slug', 'createdAt'],
      include: [
        {
          model: ThreadCategory,
          as: 'categories',
          attributes: ['createdAt'],
          include: [{
            model: Category,
            attributes: ['id', 'name'],
          }],
        },
        {
          model: User,
          required: true,
          attributes: ['id', 'username'],
        },
    ],
    });
    return threads;
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
              attributes: ['id', 'username'],
            },
            {
              model: MessageSource,
              attributes: ['id', 'label', 'url'],
            },
            {
              model: MessageRef,
              attributes: ['id', 'threadReferenceToId'],
              include: [
                {
                  model: Selection,
                  attributes: ['selectedText'],
                },
              ],
            },
          ],
        },
        {
          model: ThreadCategory,
          attributes: ['createdAt'],
          as: 'categories',
          include: [{
            model: Category,
            attributes: ['id', 'name'],
          }],
        },
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {
          model: Selection,
          attributes: ['id', 'selectedText'],
          include: [
            {
              model: Thread,
              attributes: ['title', 'id'],
            },
          ],
        },
      ],
    });
  }

  async createOne(title: string, message: string, authorId: string , categories: number[], sources: any, refThreadId, refSelectedText, refMessageId) {

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

      // Filter null if some cat doesn't exist and throw an error if there is no categories at all

      categoriesEntity = categoriesEntity.filter((el) => el !== null);

      if (categoriesEntity.length === 0) {
        throw new BadRequestException([
          { property: 'categories', constraints: ['notEmptyArray']},
        ]);
      }

      // create the relations with the categories

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

      // If the thead is created from a message selection
      if (refThreadId && refSelectedText && refMessageId) {

        // check if the related thead exists

        const refThread = await this.threadRepository.findOne({
          where: {
            id: refThreadId,
          },
        });

        if (!refThread) {
          throw new BadRequestException([
            { property: 'refThreadId', constraints: ['doesntExist']},
          ]);
        }

        // fetch the other selections

        const messageReferences = await MessageRef.findAll({
          where: {
            messageId: refMessageId,
          },
          include: [
            {
              model: Selection,
            },
          ],
        });

        // fetch the related message

        const refMessage = await Message.findOne({
          where: {
            id: refMessageId,
          },
        });

        if (!refMessage) {
          throw new BadRequestException([
            { property: 'refMessageId', constraints: ['doesntExist']},
          ]);
        }

        // check if the message is in the thread

        if (refMessage.threadId !== refThread.id) {
          throw new BadRequestException([
            { property: 'refMessageId', constraints: ['doesntExist']},
          ]);
        }
        // check the selectedText for overlaps in other selections
        for (const messageReference of messageReferences) {
          if (!refMessage.content.includes(refSelectedText)) {
            throw new BadRequestException([
              { property: 'selectedText', constraints: ['doesntExist']},
            ]);
          }
          if (messageReference.selectedItem.selectedText.includes(refSelectedText)) {
            throw new BadRequestException([
              { property: 'selectedText', constraints: ['isUnique']},
            ]);
          }
          if (refSelectedText.includes(messageReference.selectedItem.selectedText)) {
            throw new BadRequestException([
              { property: 'selectedText', constraints: ['isUnique']},
            ]);
          }
          const overlapLeft = findOverlapStart(messageReference.selectedItem.selectedText, refSelectedText, refMessage.content);
          if (overlapLeft) {
            throw new BadRequestException([
              { property: 'selectedText', constraints: ['isUnique']},
            ]);
          }
          const overlapRight = findOverlapEnd(messageReference.selectedItem.selectedText, refSelectedText, refMessage.content);
          if (overlapRight) {
            throw new BadRequestException([
              { property: 'selectedText', constraints: ['isUnique']},
            ]);
          }
        }

        // Créer la selection Selection selectedText, threadReferenceToId
        const selection = new Selection({
          selectedText: refSelectedText,
          threadReferencedFromId: refThread.id,
        });

        await selection.save({ transaction });

        // Créer le lien vers message MessageRef selectionId, messageId

        const messageRef = new MessageRef({
          selectionId: selection.id,
          messageId: refMessage.id,
          threadReferenceToId: thread.id,
        });

        await messageRef.save({ transaction });

        // Ajouter la selection dans le thread thread.selectionId
        thread.selectionId = selection.id;

        await thread.save({ transaction });
      }

      // create the sources
      for (const source of sources) {
        const messageSource = new MessageSource({
          messageId: threadMessage.id,
          label: source.label,
          url: source.url,
        });

        await messageSource.save({ transaction });
      }
      // Commit
      await transaction.commit();

      return this.findOne(thread.id);

    } catch (err) {
      // Rollback if errors
      await transaction.rollback();
      throw err;
    }
  }
}
