import { Injectable, Inject } from '@nestjs/common';
import { WebSocketGatewayServer } from 'src/sockets/gateway';
import { Thread } from 'src/thread/models/thread.entity';
import { Message } from 'src/message/models/message.entity';
import { User } from 'src/users/models/user.entity';
import { ThreadFollowers } from 'src/thread/models/thread-followers.entity';
import { Notification } from './models/notification';

interface IThreadMessageNotification {
  type: string;
  userId: number;
  payload: IThreadMessageNotificationPayload;
}

interface IThreadMessageNotificationPayload {
  threadId: number;
  authorName: string;
  authorThumbnail: string;
  threadSlug: string;
  threadTitle: string;
  messageId: number;
}

@Injectable()
export class NotificationService {
  constructor(
    @Inject(WebSocketGatewayServer)
    private readonly wsServer: WebSocketGatewayServer,
  ) {}

  async threadMessageNotification(message: Message) {
    if (!message) {
      return;
    }

    const thread = await Thread.findOne({
      where: {
        id: message.threadId,
      },
      include: [
        {
          model: User,
          attributes: ['username', 'avatarFileName'],
        },
        {
          model: ThreadFollowers,
          attributes: ['threadId', 'userId'],
        },
      ],
    });

    if (!thread) {
      return;
    }

    const entities = [];

    const notificationPayload: IThreadMessageNotificationPayload = {
      threadId: thread.id,
      authorName: message.author.username,
      authorThumbnail: message.author.avatarFileName,
      threadSlug: thread.slug,
      threadTitle: thread.title,
      messageId: message.id,
    };

    thread.followers.forEach(follower => {
      if (follower.userId !== message.author.id) {
        const notification = {
          userId: follower.userId,
          type: 'threadMessage',
          payload: notificationPayload,
        };
        entities.push(notification);

        try {
          this.pushMessageThreadNotification(notification);
        } catch (err) {
          console.log(err);
        }
      }
    });

    await Notification.bulkCreate(entities);
  }

  pushMessageThreadNotification(notification: IThreadMessageNotification) {
    const clients = this.wsServer.authClients.filter(
      authClient => authClient.userId === notification.userId,
    );

    if (Array.isArray(clients) && clients.length > 0) {
      for (const client of clients) {
        this.wsServer.server
          .to(client.clientId)
          .emit('notifications', notification);
      }
    }
  }
}
