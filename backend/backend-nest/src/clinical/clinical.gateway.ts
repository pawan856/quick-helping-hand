import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ClinicalGateway {
  @WebSocketServer()
  server: Server;

  // Real-time events for vitals, labs, etc.
}
