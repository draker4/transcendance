import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../guard/wsJwt.guard';
import { verify } from 'jsonwebtoken';
import { GameService } from '../service/game.service';

@WebSocketGateway({
  cors: {
    origin: [`http://${process.env.HOST_IP}:3000`, 'http://localhost:3000'],
  },
  namespace: '/game',
  path: '/game/socket.io',
})
@UseGuards(WsJwtGuard)
export class GameGateway implements OnModuleInit {
  // Container of connected users : Map<userId, socket.id>
  private connectedUsers: Map<string, string> = new Map<string, string>();

  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const token = socket.handshake.headers.authorization?.split(' ')[1];

      try {
        const payload = verify(token, process.env.JWT_SECRET) as any;

        if (!payload.sub) {
          socket.disconnect();
          return;
        }

        this.connectedUsers.set(payload.sub, socket.id);

        socket.on('disconnect', () => {
          this.connectedUsers.delete(payload.sub);
          console.log(`User with ID ${payload.sub} disconnected`);
          console.log(this.connectedUsers);
        });

        // [+] ici gestion des room a join en fonction des channels de l'user ?
        socket.join('1 2'); // [!] en vrac&brut pour test

        console.log('connected users = ', this.connectedUsers);
      } catch (error) {
        console.log(error);
        socket.disconnect();
      }
    });
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
