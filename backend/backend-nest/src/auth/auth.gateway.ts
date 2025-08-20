import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class AuthGateway {
  @WebSocketServer()
  server: Server;

  // Real-time auth events (2FA, login notifications)
}
