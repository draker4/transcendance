//standard imports
import { OnModuleInit, UseGuards, Req } from '@nestjs/common';

// websockets imports
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// jwt imports
import { WsJwtGuard } from '../guard/wsJwt.guard';
import { verify } from 'jsonwebtoken';

import { GameService } from '../service/game.service';
import { GameManager } from '../class/GameManager';

@WebSocketGateway({
  cors: {
    origin: [`http://${process.env.HOST_IP}:3000`, 'http://localhost:3000'],
  },
  namespace: '/game',
  path: '/game/socket.io',
})
@UseGuards(WsJwtGuard)
export class GameGateway implements OnModuleInit {
  constructor(
    private readonly gameService: GameService,
    private readonly gameManager: GameManager,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.gameManager.setServer(this.server);

    this.server.on('connection', (socket: Socket) => {
      const token = socket.handshake.headers.authorization?.split(' ')[1];

      try {
        //check if token is valid and get user id(payload.sub)
        const payload = verify(token, process.env.JWT_SECRET) as any;
        if (!payload.sub) {
          socket.disconnect();
          return;
        }

        socket.on('disconnect', () => {
          console.log(`User with ID ${payload.sub} disconnected`);
          this.gameManager.disconnect(payload.sub, socket);
          socket.disconnect();
        });
      } catch (error) {
        console.log(error);
        socket.disconnect();
      }
    });
  }

  @SubscribeMessage('join')
  async joinGame(
    @MessageBody() gameId: string,
    @Req() req,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('Join Game: ' + gameId + ' by User ' + req.user.id);
    return await this.gameManager.joinGame(gameId, req.user.id, socket);
  }
}
