import { Server, Socket } from 'socket.io';
import { Pong } from './Pong';
import { LobbyService } from '../../lobby/lobby-service/lobby.service';
import { WsException } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { ActionDTO } from '../dto/Action.dto';
import { UserInfo } from './UserInfo';

@Injectable()
export class GameManager {
  // -----------------------------------  VARIABLE  ----------------------------------- //
  private readonly pongOnGoing: Map<Pong['uuid'], Pong> = new Map<
    Pong['uuid'],
    Pong
  >();
  private usersConnected: UserInfo[] = [];
  private server: Server;

  // ----------------------------------  CONSTRUCTOR  --------------------------------- //

  constructor(private readonly lobbyService: LobbyService) {
    console.log('GameManager created');
  }

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  public setServer(server: Server): void {
    this.server = server;
    console.log('GameManager setup with server');
  }

  public async joinGame(
    gameId: string,
    userId: number,
    socket: Socket,
  ): Promise<any> {
    const game = this.pongOnGoing.get(gameId);

    // If game doesn't exist, create it
    if (!game) {
      try {
        console.log(`Game ${gameId} haven't beed started yet`);
        return await this.createPong(gameId, userId, socket);
      } catch (error) {
        throw new WsException(error.message);
      }
    }

    // Add the user to userInfo array
    const user = new UserInfo(userId, socket, gameId);
    this.usersConnected.push(user);
    return game.join(user);
  }

  public async playerAction(action: ActionDTO, userId: number): Promise<any> {
    const pong = this.pongOnGoing.get(action.gameId);
    if (!pong) {
      throw new WsException('Game not found');
    }
    return pong.playerAction(userId, action);
  }

  public async disconnect(userId: number, socket: Socket): Promise<any> {
    // Find user in the collection based on userId and socketId
    const user = this.usersConnected.find(
      (user) => user.id === userId && user.socket.id === socket.id,
    );
    if (!user) {
      throw new WsException('User not found');
    }

    //Find the game linked to the user
    const pong = this.pongOnGoing.get(user.gameId);
    if (!pong) {
      throw new WsException('Game not found');
    }

    // Remove the user from the game and userConnected array
    pong.disconnect(user);
    this.usersConnected = this.usersConnected.filter(
      (user) => user.id !== userId && user.socket.id !== socket.id,
    );
  }

  // ---------------------------------  PRIVATE METHODS  -------------------------------- //

  private async createPong(
    gameId: string,
    userId: number,
    socket: Socket,
  ): Promise<any> {
    try {
      const data = await this.lobbyService.GetGameById(gameId, userId);
      if (data.success === false) {
        throw new WsException(data.message);
      } else {
        const pong = new Pong(this.server, gameId, data.data);
        this.pongOnGoing.set(gameId, pong);
        return this.joinGame(gameId, userId, socket);
      }
    } catch (error) {
      throw new WsException(error.message);
    }
  }
}
