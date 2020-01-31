import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from 'src/appConsts/sequelizeRepository';
import { Message } from 'src/message/message.entity';
import { Scoring } from 'src/scoring/scoring.entity';
import sequelize = require('sequelize');
import { ScoringLabel } from 'src/scoring/scoring-label.entity';

@Injectable()
export class MessageService {
  constructor(
    @Inject(MESSAGE_REPOSITORY) private readonly messageRepository: typeof Message,
  ) {}

  getMyVotes(userId, messageId) {
    // return Scoring.findAll({
    //   where: {
    //     messageId,
    //     userId,
    //   },
    //   // @ts-ignore
    //   attributes: [
    //     [sequelize.col('scoringCategory.name'), 'category'],
    //   ],
    //   include: [
    //     {
    //       model: ScoringLabel,
    //       attributes: [],
    //     },
    //   ],
    // });
    return Scoring.findAll({
      where: {
        userId,
        messageId,
      },
      include: [
        {
          model: ScoringLabel,
          attributes: [],
        },
      ],
      attributes: [
        'value',
        [sequelize.literal('scoringCategory.name'), 'category'],
        [sequelize.literal('scoringCategory.id'), 'categoryId'],
      ],
    });
  }

  async voteMessage(categories, userId, messageId) {

    // Vérifier si le message existe

    const message =  await Message.findOne({
      where: {
        id: messageId,
      },
    });

    // Sinon erreur

    if (!message) {
      throw new NotFoundException();
    }

    // Pour chaque catégorie envoyée on vérifie si elle existe

    for (const category of categories) {
      const cat = await ScoringLabel.findOne({
        where: {
          id: category.id,
        },
      });

      /**
       * Si la catégorie existe on vérifie si un vote n'est pas déjà enregistre
       * pour l'utilisateur sur le message avec la catégorie
       */
      if (cat) {
        const scoringVal = await Scoring.findOne({
          where: {
            scoringCategoryId: cat.id,
            userId,
            messageId,
          },
        });

        // Si elle existe on met à jour la valeur

        if (scoringVal) {
          console.log('------------------ Le vote existe déjà et va être remplacé');
          scoringVal.value = category.value;
          await scoringVal.save();
        } else {
          console.log('------------------ Le vote n existe pas');
          // Sinon on créer l'entrée dans la base de donnée
          const newVote = new Scoring({
            scoringCategoryId: category.id,
            messageId,
            userId,
            value: category.value,
          });
          await newVote.save();
        }
      }
    }
  }

  getMessageVotes(id) {
    return Scoring.findAll({
      where: {
        messageId: id,
      },
      attributes: [
        [sequelize.literal('scoringCategory.name'), 'category'],
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
      ],
      group: ['scoringCategoryId'],

    });
    // hfjdklfhs
  }
}
