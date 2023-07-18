import { Server } from 'socket.io';
import { Pong } from './Pong';
import { LobbyService } from 'src/lobby/lobby-service/lobby.service';
import { WsException } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameManager {
  // -----------------------------------  VARIABLE  ----------------------------------- //
  private readonly lobbies: Map<Pong['uuid'], Pong> = new Map<
    Pong['uuid'],
    Pong
  >();
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

  public async joinGame(gameId: string, userId: number): Promise<any> {
    const game = this.lobbies.get(gameId);

    // If game doesn't exist, create it
    if (!game) {
      try {
        console.log('game doesnt exist');
        return await this.createGame(gameId, userId);
      } catch (error) {
        // throw new WsException(error.message);
      }
    }

    // if user is a player join the game as a Player
    if (userId === game.gameData.host || userId === game.gameData.opponent) {
      game.joinPlayer(userId);
    }

    // if user is a spectator join the game as a Spectator
    else {
      game.joinSpectator(userId);
    }
    return await this.lobbyService.GetGameById(gameId, userId);
  }

  // public Leave(partyId: string): void {}

  // ---------------------------------  PRIVATE METHODS  -------------------------------- //

  private async createGame(gameId: string, userId: number): Promise<any> {
    try {
      console.log('Create Game: ' + gameId + ' by UserId: ' + userId);
      const data = await this.lobbyService.GetGameById(gameId, userId);

      if (data.success === false) {
        console.log(
          'game doesnt exist and cant be created: ' +
            data.message +
            ' ' +
            data.error,
        );
        throw new WsException(data.message);
      } else {
        console.log('game exist and can be created: ' + data);
        const pong = new Pong(this.server, gameId, data.data);
        this.lobbies.set(gameId, pong);
        console.log('Pong created: ' + gameId + ' pong ' + pong);
        return data;
      }
    } catch (error) {
      console.log('error: ' + error);
      //throw new WsException(error.message);
    }
  }
}
