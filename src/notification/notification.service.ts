// import { Injectable, Inject } from '@nestjs/common';
// import { WebSocketGatewayServer } from 'src/sockets/gateway';
// import { Thread } from 'src/thread/models/thread.entity';
// import { ThreadNotification } from './models/thread-notification.entity';
// import { Client } from 'socket.io';
// import { Message } from 'src/message/models/message.entity';
// import { User } from 'src/users/models/user.entity';
// import { ThreadFollowers } from 'src/thread/models/thread-followers.entity';

// @Injectable()
// export class NotificationService {
//   constructor(
//     @Inject(WebSocketGatewayServer)
//     private readonly wsServer: WebSocketGatewayServer,
//   ) {}

//   async threadMessageNotification(message: Message) {
//     if (!message) {
//       return;
//     }
//     const thread = await Thread.findOne({
//       where: {
//         id: message.threadId,
//       },
//       include: [
//         {
//           model: User,
//           attributes: ['username'],
//         },
//         {
//           model: ThreadFollowers,
//           attributes: ['threadId', 'userId'],
//         },
//       ],
//     });

//     if (!thread) {
//       return;
//     }

//     const entities = [];

//     thread.followers.forEach(follower => {
//       if (follower.userId !== message.author.id) {
//         const notificationEntity = {
//           threadId: thread.id,
//           userId: follower.userId,
//         };
//         entities.push(notificationEntity);

//         try {
//           this.pushMessageThreadNotification(thread, message, follower.userId);
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     });
//     await ThreadNotification.bulkCreate(entities);
//   }

//   pushMessageThreadNotification(thread: Thread, message: Message, userId) {
//     const data = {
//       type: 'NEW_THREAD_MESSAGE',
//       payload: {
//         title: thread.title,
//         author: thread.author,
//         messagePreview: message.content.slice(0, 20),
//       },
//     };

//     const clients = WebSocketGatewayServer.authClients.filter(
//       authClient => authClient.userId === userId,
//     );

//     if (Array.isArray(clients) && clients.length > 0) {
//       for (const client of clients) {
//         this.wsServer.server.to(client.clientId).emit('notifications', data);
//       }
//     }
//   }
// }
