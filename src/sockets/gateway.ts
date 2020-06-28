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
import { Logger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

interface ILoginWsPayload {
  token: string;
}

interface IAuthUser {
  clientId: string;
  userId: number;
}

@Injectable()
@WebSocketGateway()
export class WebSocketGatewayServer
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private jwtService: JwtService;
  private logger: Logger = new Logger('AppGateway');
  public authClients: IAuthUser[] = [];

  @WebSocketServer() public server: Server;

  constructor() {
    const jwtService = new JwtService({
      secret: jwtConstants.secret,
      verifyOptions: {
        ignoreExpiration: false,
      },
    });
    this.jwtService = jwtService;
  }

  testMachin(clientId: string) {
    this.server.to(clientId).emit('notifications', 'coucou');

    // setTimeout(() => {
    //   this.testMachin(clientId);
    // }, 2000);
  }

  /**
   * Verify the token and add the user to the authenticated list
   * @param client Socket
   * @param payload ILoginWsPayload
   */
  @SubscribeMessage('login')
  async handleLogin(client: Socket, payload: ILoginWsPayload): Promise<void> {
    const { token } = payload;

    const isAlreadyAuthenticated = this.authClients.find(
      cl => cl.clientId === client.id,
    );

    if (token && !isAlreadyAuthenticated) {
      try {
        const verifiedToken = this.jwtService.verify(token);
        if (verifiedToken) {
          this.addAuthClient(verifiedToken.sub, client.id);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  /**
   * Add the authenticated user to the "authClient" list
   * @param user IAuthUser
   */

  private addAuthClient(userId: number, clientId: string) {
    const isAlreadyAuthenticated = !!this.authClients.find(
      authClient => authClient.clientId === clientId,
    );

    if (!isAlreadyAuthenticated) {
      this.authClients.push({
        userId,
        clientId,
      });
      setTimeout(() => {
        this.testMachin(clientId);
      }, 2000);
    }
  }

  /**
   * Remove the user from the authenticated list
   * @param clientId string
   */
  private removeAuthClient(clientId: string) {
    const clientToRemove = this.authClients.find(
      cl => cl.clientId === clientId,
    );

    if (clientToRemove) {
      const newAuthClients = this.authClients.filter(
        authClient => authClient.clientId !== clientId,
      );
      this.authClients = newAuthClients;
    }
  }

  /**
   * Action to do after the server is initialized
   * @param server Server
   */

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  /**
   * Actions to do when the user disconnects
   * @param client Socket
   */

  handleDisconnect(client: Socket) {
    this.removeAuthClient(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Actions to do when a user connects to the ws
   * @param client Socket
   * @param args any
   */

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
