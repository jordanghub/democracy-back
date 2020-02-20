import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@WebSocketGateway()
export class WebSocketGatewayServer
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  // static authClients = [];

  // static addAuthClient(user) {
  //   if (
  //     !this.authClients.find(
  //       authClient => authClient.clientId === user.clientId,
  //     )
  //   ) {
  //     this.authClients.push(user);
  //   }
  // }
  // static removeAuthClient(clientId) {
  //   const newAuthClients = this.authClients.filter(
  //     authClient => authClient.clientId !== clientId,
  //   );

  //   this.authClients = newAuthClients;
  // }

  // private jwtService: JwtService;

  // constructor() {
  //   const jwtService = new JwtService({
  //     secret: jwtConstants.secret,
  //     verifyOptions: {
  //       ignoreExpiration: false,
  //     },
  //   });
  //   this.jwtService = jwtService;
  // }

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
    // WebSocketGatewayServer.removeAuthClient(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    // const { token } = client.handshake.query;

    // if (token) {
    //   try {
    //     const verifiedToken = this.jwtService.verify(token);
    //     if (verifiedToken) {
    //       const user = {
    //         userId: verifiedToken.sub,
    //         clientId: client.id,
    //       };

    //       WebSocketGatewayServer.addAuthClient(user);
    //     }
    //   } catch (err) {
    //     console.log(err);
    //     console.log('une erreur');
    //   }
    // }
    // Si il y a un token, ajoute le client connecté dans la liste des clients connectés
    this.logger.log(`Client connected: ${client.id}`);
  }
}
