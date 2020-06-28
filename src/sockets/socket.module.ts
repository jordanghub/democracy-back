import { Module, Global } from '@nestjs/common';
import { WebSocketGatewayServer } from 'src/sockets/gateway';

@Module({
  providers: [WebSocketGatewayServer],
  exports: [WebSocketGatewayServer],
})
export class WebsocketModule {}
