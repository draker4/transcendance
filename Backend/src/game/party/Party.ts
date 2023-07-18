import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from 'src/utils/types/game.types';
import { Pong } from '../pong/Pong';
import { LobbyService } from 'src/lobby/lobby-service/lobby.service';

export class Party {
  public readonly createdAt: Date = new Date();
  public readonly pong: Pong;
  private readonly lobbyService: LobbyService;

  constructor(private readonly server: Server, public readonly uuid: string) {}
}
