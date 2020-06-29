// @ts-nocheck

import {
  Injectable,
  Inject,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import urlSlug from 'url-slug';
import uniqueSlug from 'unique-slug';

import { THREAD_REPOSITORY } from 'src/appConsts/sequelizeRepository';
import { Thread } from 'src/thread/models/thread.entity';
import { Message } from 'src/message/models/message.entity';
import { User } from 'src/users/models/user.entity';
import { ThreadCategory } from 'src/categories/models/thread-category.entity';
import { Category } from 'src/categories/models/category.entity';
import { Scoring } from 'src/scoring/scoring.entity';
import sequelize = require('sequelize');
import { ScoringLabel } from 'src/scoring/models/scoring-label.entity';
import { MessageSource } from 'src/message/models/message-source.entity';
import { MessageService } from 'src/message/message.service';
import { Selection } from './models/selection.entity';
import { MessageRef } from 'src/message/models/message-ref.entity';
import { pagination } from 'src/utils/sequelize-pagination';
import { findOverlapStart, findOverlapEnd } from 'src/utils/stringOverlap';
import { ThreadFollowers } from './models/thread-followers.entity';
import { PermissionService } from 'src/permissions/permissions.service';
import { ThreadLockedData } from './models/thread-lock-data.entity';
@Injectable()
export class ThreadService {
  constructor(
    @Inject(THREAD_REPOSITORY) private readonly threadRepository: typeof Thread,
    @Inject(MessageService) private readonly messageService: MessageService,
    @Inject(PermissionService)
    private readonly permissionService: PermissionService,
  ) {}

  async lockThread(userId, threadId, lockData) {
    const allowedRoles = ['ROLE_MODERATOR', 'ROLE_ADMIN'];

    const thread = await Thread.findOne({
      where: {
        id: threadId,
      },
    });

    if (!thread) {
      throw new NotFoundException();
    }

    try {
      const isAllowed = await this.permissionService.checkIfUserHasRoles(
        userId,
        allowedRoles,
      );

      if (!isAllowed) {
        throw new ForbiddenException();
      }

      const alreadyLocked = await ThreadLockedData.findOne({
        where: {
          threadId,
        },
      });

      if (alreadyLocked) {
        await alreadyLocked.destroy();
        return;
      }

      const data: any = {
        userId,
        threadId,
      };

      if (lockData.reason) {
        data.reason = lockData.reason;
      }

      const lockedData = new ThreadLockedData(data);

      await lockedData.save();
    } catch (err) {
      throw new ForbiddenException();
    }
  }

  async answerToThread(
    userId: number | string,
    threadId: number | string,
    content: string,
    sources: any,
  ) {
    const sequelize = this.threadRepository.sequelize;

    const transaction = await sequelize.transaction();

    const thread = await Thread.findOne({
      where: {
        id: threadId,
      },
      include: [
        {
          model: ThreadLockedData,
          attributes: ['id'],
        },
      ],
    });

    if (!thread) {
      throw new NotFoundException();
    }

    if (!!thread.locked) {
      const isAllowed = await this.permissionService.checkIfUserHasRoles(
        userId,
        ['ROLE_ADMIN', 'ROLE_MODERATOR'],
      );

      if (!isAllowed) {
        throw new ForbiddenException();
      }
    }

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

      return message;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async findMessagesVoteAverage(id) {
    return Scoring.findAll({
      attributes: [
        // @ts-ignore
        [sequelize.col('scoringCategory.name'), 'category'],
        [
          sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('value'))),
          'average',
        ],
        [sequelize.fn('COUNT', sequelize.col('value')), 'voteCount'],
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

  async findAll(page: number = 1, pageSize: number = 5, userId = null) {
    const includeRelations = [
      {
        model: ThreadCategory,
        as: 'categories',
        attributes: ['createdAt'],
        include: [
          {
            model: Category,
            attributes: ['id', 'name'],
          },
        ],
      },

      {
        model: User,
        required: true,
        attributes: ['id', 'username', 'avatarFileName'],
      },
      {
        model: Scoring,
        attributes: [
          // @ts-ignore
          [sequelize.col('scoringCategory.name'), 'category'],
          [
            sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('value'))),
            'average',
          ],
          [sequelize.fn('COUNT', sequelize.col('value')), 'voteCount'],
        ],
        separate: true,
        include: [
          {
            model: ScoringLabel,
            attributes: [],
          },
        ],
        // @ts-ignore
        group: ['threadId', 'scoringCategory.id'],
      },
    ];

    if (userId) {
      includeRelations.push({
        model: ThreadFollowers,
        where: {
          userId,
        },
        separate: true,
      });
    }

    const threads = this.threadRepository.findAndCountAll({
      ...pagination({ page, pageSize }),
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'slug', 'createdAt'],
      include: includeRelations,
    });
    return threads;
  }

  async findAllCurrentUserThreads(
    userId: number | string,
    page: number = 1,
    pageSize: number = 5,
  ) {
    const threads = this.threadRepository.findAndCountAll({
      ...pagination({ page, pageSize }),
      where: {
        userId,
      },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'slug', 'createdAt'],
      include: [
        {
          model: ThreadCategory,
          as: 'categories',
          attributes: ['createdAt'],
          include: [
            {
              model: Category,
              attributes: ['id', 'name'],
            },
          ],
        },
        {
          model: User,
          required: true,
          attributes: ['id', 'username', 'avatarFileName'],
        },
      ],
    });
    return threads;
  }

  async findOne(id: string): Promise<Thread> {
    // @ts-ignore
    return this.threadRepository.findOne<Thread | undefined>({
      where: {
        slug: id,
      },
      attributes: ['id', 'title', 'slug', 'createdAt', 'userId'],
      include: [
        {
          model: ThreadLockedData,
          attributes: ['reason'],
          include: [
            {
              model: User,
              attributes: ['username', 'avatarFileName'],
            },
          ],
        },
        {
          model: Message,
          attributes: ['id', 'content', 'createdAt'],
          include: [
            {
              model: User,
              attributes: ['id', 'username', 'avatarFileName'],
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
                  include: [
                    {
                      model: Thread,
                      as: 'referenceThread',
                      attributes: ['id', 'slug'],
                    },
                  ],
                },
              ],
            },
            {
              model: Scoring,
              attributes: [
                [sequelize.col('scoringCategory.name'), 'category'],
                [
                  sequelize.fn(
                    'ROUND',
                    sequelize.fn('AVG', sequelize.col('value')),
                  ),
                  'average',
                ],
                [sequelize.fn('COUNT', sequelize.col('value')), 'voteCount'],
              ],
              separate: true,
              include: [
                {
                  model: ScoringLabel,
                  attributes: [],
                },
              ],
              // @ts-ignore
              group: ['messageId', 'scoringCategory.id'],
            },
          ],
        },
        {
          model: ThreadCategory,
          attributes: ['createdAt'],
          as: 'categories',
          include: [
            {
              model: Category,
              attributes: ['id', 'name'],
            },
          ],
        },
        {
          model: User,
          attributes: ['id', 'username', 'avatarFileName'],
        },
        {
          model: Selection,
          attributes: ['id', 'selectedText'],
          include: [
            {
              model: Thread,
              as: 'thread',
              attributes: ['title', 'id', 'slug'],
            },
          ],
        },
        {
          model: Scoring,
          attributes: [
            [sequelize.col('scoringCategory.name'), 'category'],
            [
              sequelize.fn(
                'ROUND',
                sequelize.fn('AVG', sequelize.col('value')),
              ),
              'average',
            ],
            [sequelize.fn('COUNT', sequelize.col('value')), 'voteCount'],
          ],
          separate: true,
          include: [
            {
              model: ScoringLabel,
              attributes: [],
            },
          ],
          // @ts-ignore
          group: ['threadId', 'scoringCategory.id'],
        },
      ],
    });
  }

  async createOne(
    title: string,
    message: string,
    authorId: string,
    categories: number[],
    sources: any,
    refThreadId: number,
    refSelectedText: string,
    refMessageId: number,
  ) {
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

      const threadSlug = urlSlug(title, {
        separator: '-',
      });
      const threadSlugRandomPart = uniqueSlug();
      const thread = new this.threadRepository({
        title,
        userId: authorEntity.id,
        slug: `${threadSlug}-${threadSlugRandomPart}`,
      });

      await thread.save({ transaction });

      // Fetch the list of the categories

      let categoriesEntity = await Promise.all(
        categories.map(catId => {
          return Category.findOne({
            where: {
              id: catId,
            },
          });
        }),
      );

      // Filter null if some cat doesn't exist and throw an error if there is no categories at all

      categoriesEntity = categoriesEntity.filter(el => el !== null);

      if (categoriesEntity.length === 0) {
        throw new BadRequestException([
          { property: 'categories', constraints: ['notEmptyArray'] },
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
            { property: 'refThreadId', constraints: ['doesntExist'] },
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
            { property: 'refMessageId', constraints: ['doesntExist'] },
          ]);
        }

        // check if the message is in the thread

        if (refMessage.threadId !== refThread.id) {
          throw new BadRequestException([
            { property: 'refMessageId', constraints: ['doesntExist'] },
          ]);
        }
        // check the selectedText for overlaps in other selections
        for (const messageReference of messageReferences) {
          if (!refMessage.content.includes(refSelectedText)) {
            throw new BadRequestException([
              { property: 'selectedText', constraints: ['doesntExist'] },
            ]);
          }
          if (messageReference.selectedItem.selectedText === refSelectedText) {
            throw new BadRequestException([
              { property: 'selectedText', constraints: ['isUnique'] },
            ]);
          }

          if (
            refSelectedText.includes(messageReference.selectedItem.selectedText)
          ) {
            throw new BadRequestException([
              { property: 'selectedText', constraints: ['isUnique'] },
            ]);
          }
          if (
            messageReference.selectedItem.selectedText.includes(refSelectedText)
          ) {
            throw new BadRequestException([
              { property: 'selectedText', constraints: ['isUnique'] },
            ]);
          }
          const overlapLeft = findOverlapStart(
            messageReference.selectedItem.selectedText,
            refSelectedText,
            refMessage.content,
          );
          if (overlapLeft) {
            throw new BadRequestException([
              { property: 'selectedText', constraints: ['isUnique'] },
            ]);
          }
          const overlapRight = findOverlapEnd(
            messageReference.selectedItem.selectedText,
            refSelectedText,
            refMessage.content,
          );
          if (overlapRight) {
            throw new BadRequestException([
              { property: 'selectedText', constraints: ['isUnique'] },
            ]);
          }
        }

        // Créer la selection Selection selectedText, threadReferenceToId
        const selection = new Selection({
          selectedText: refSelectedText,
          threadReferencedFromId: refThread.id,
          threadReferenceToId: thread.id,
        });

        await selection.save({ transaction });

        // Créer le lien vers message MessageRef selectionId, messageId

        const messageRef = new MessageRef({
          selectionId: selection.id,
          messageId: refMessage.id,
          threadReferenceToId: thread.id,
        });

        await messageRef.save({ transaction });

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

      const newFollow = new ThreadFollowers({
        userId: authorEntity.id,
        threadId: thread.id,
      });

      await newFollow.save({ transaction });

      await transaction.commit();

      return this.findOne(thread.slug);
    } catch (err) {
      // Rollback if errors
      console.log(err);
      await transaction.rollback();
      throw err;
    }
  }
  async toggleThreadFollow(threadId, userId) {
    const thread = await this.threadRepository.findOne({
      where: {
        id: threadId,
      },
    });

    if (!thread) {
      throw new NotFoundException();
    }

    const alreadyFollowing = await ThreadFollowers.findOne({
      where: {
        userId,
      },
    });

    if (alreadyFollowing) {
      await alreadyFollowing.destroy();
      return false;
    }

    const newFollow = new ThreadFollowers({
      threadId,
      userId,
    });

    await newFollow.save();

    return true;
  }
}
