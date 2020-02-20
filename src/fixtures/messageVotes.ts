import { ScoringLabel } from 'src/scoring/models/scoring-label.entity';
import { Message } from 'src/message/models/message.entity';
import { User } from 'src/users/models/user.entity';
import { Scoring } from 'src/scoring/scoring.entity';

export const createFakeScoring = () => {
  return new Promise(async (resolve, reject) => {
    const messages = await Message.findAll();
    const scoringLabels = await ScoringLabel.findAll();
    const users = await User.findAll();

    for (const user of users) {
      const doesVote = Math.floor(Math.random() * Math.floor(101));

      if (doesVote % 2 === 0) {
        for (const scoringLabel of scoringLabels) {
          for (const message of messages) {
            const doesVoteOnMessage = Math.floor(
              Math.random() * Math.floor(101),
            );
            if (doesVoteOnMessage % 2 === 0) {
              const scoring = new Scoring({
                userId: user.id,
                messageId: message.id,
                scoringCategoryId: scoringLabel.id,
                value: Math.floor(Math.random() * 101),
              });
              await scoring.save();
            }
          }
        }
      }
    }
    resolve();
  });
};
