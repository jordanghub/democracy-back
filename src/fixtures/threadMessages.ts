import { Thread } from 'src/thread/models/thread.entity';
import { Message } from 'src/message/models/message.entity';

export const fakeThreadResponse = async () => {
  return new Promise(async resolve => {
    const threads = await Thread.findAll();

    for (let nb = 0; nb < 20; nb++) {
      const shouldCreate = Math.floor(Math.random() * Math.floor(10));

      for (const thread of threads) {
        if (shouldCreate % 2 === 0) {
          const message = new Message({
            content: `Un contenu pour le thread ${thread.id} pour le message n° ${nb} dans la boucle`,
            threadId: thread.id,
            userId: 1,
          });
          await message.save();
        }
      }
    }
    resolve();
  });
};
