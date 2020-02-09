import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class WebSocketGatewayServer implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }

  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload);
   }

  afterInit(server: Server) {
    this.logger.log('Init');
   }

   handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
   }

   handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
   }
}
