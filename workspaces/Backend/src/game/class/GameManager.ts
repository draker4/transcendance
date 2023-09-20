// import standard nest packages
import { Server, Socket } from 'socket.io';
// import { WsException } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';

// import game classes
import { Pong } from './Pong';
import { UserInfo } from './UserInfo';
import { ActionDTO } from '../dto/Action.dto';
import { Game } from '@/utils/typeorm/Game.entity';
import {
  CHECK_INTERVAL,
  PLAYER_PING,
  SPECTATOR_PING,
} from '@transcendence/shared/constants/Game.constants';

// import services
import { GameService } from '../service/game.service';
import { ColoredLogger } from '../colored-logger';
import { ScoreService } from '@/score/service/score.service';
import { ScoreInfo } from '@transcendence/shared/types/Score.types';
import { StatsService } from '@/stats/service/stats.service';
import { StatusService } from '@/statusService/status.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class GameManager {
  // -----------------------------------  VARIABLES  ----------------------------------- //
  private readonly pongOnGoing: Map<string, Pong> = new Map<string, Pong>();
  public usersConnected: UserInfo[] = [];
  private server: Server;

  // ----------------------------------  CONSTRUCTOR  --------------------------------- //

  constructor(
    private readonly gameService: GameService,
    private readonly scoreService: ScoreService,
    private readonly statsService: StatsService,
    private readonly statusService: StatusService,
    private readonly logger: ColoredLogger,
  ) {
    this.logger = new ColoredLogger(GameManager.name); // Set the module name for the logger
  }

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  // Set the WebSocket server instance in the game manager to handle game-related functionality
  public setServer(server: Server): void {
    this.server = server;
    setInterval(() => {
      this.checkConnexion();
    }, CHECK_INTERVAL);
  }

  // Method to handle user joining a game
  public async joinGame(
    gameId: string,
    userId: number,
    socket: Socket,
  ): Promise<any> {
    const game = this.pongOnGoing.get(gameId);
    if (!game) {
      try {
        return this.createPong(gameId, userId, socket);
      } catch (error) {
        this.logger.error(
          `Can't create Pong Session: ${error.message}`,
          'joinGame',
          error,
        );
        return;
      }
    }

    let user = this.usersConnected.find((user) => user.socket.id === socket.id);
    if (!user) {
      user = new UserInfo(userId, socket, gameId, false);
      this.usersConnected.push(user);
    }
    try {
      const data: ReturnData = await game.join(user);
      return data;
    } catch (error) {
      this.logger.error(
        `Error while joining game: ${error.message}`,
        'joinGame',
        error,
      );
      throw new WsException(`Error while joining game: ${error.message}`);
    }
  }

  // Method to handle player actions in the game
  public async playerAction(action: ActionDTO, socket: Socket): Promise<any> {
    const pong = this.pongOnGoing.get(action.gameId);
    if (!pong) {
      this.logger.error(
        `Game with ID ${action.gameId} not found`,
        'playerAction',
      );
      return { status: false, message: 'Game not found' };
    }
    const user = this.usersConnected.find(
      (user) => user.socket.id === socket.id,
    );
    if (!user) {
      this.logger.error(`User with ID ${action.userId} not found`);
      return { status: false, message: 'User not found' };
    }
    user.pingSend = 0;
    pong.playerAction(action);
    return {
      status: true,
      message: `Action ${action.move} realised for player ${action.userId}`,
    };
  }

  // Method to handle user updating their heartbeat to stay connected
  public updatePong(userId: number, socket: Socket): void {
    const user = this.usersConnected.find(
      (user) => user.socket.id === socket.id,
    );
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`, 'updatePong');
      return;
    }
    user.pingSend = 0;
  }

  // Method to handle user disconnection from a game
  public disconnect(userId: number, socket: Socket, manual: boolean) {
    const user = this.usersConnected.find(
      (user) => user.socket.id === socket.id,
    );
    if (!user) {
      this.logger.error(
        `User with ID ${userId} not found`,
        'Manager - disconnect',
      );
      return { success: false, message: `User with ID ${userId} not found` };
    }

    //Find the game linked to the user
    const pong = this.pongOnGoing.get(user.gameId);
    if (!pong) {
      this.logger.error(
        `Game with ID ${user.gameId} not found`,
        'Manager - disconnect',
      );
      return {
        success: false,
        message: `Game with ID ${user.gameId} not found`,
      };
    }

    // Remove the user from the game and userConnected array
    const ret = pong.disconnect(user, manual);
    this.logger.log(`Pong disconnect message ${ret.message}`, 'disconnect');
    this.usersConnected = this.usersConnected.filter(
      (user) => user.socket.id !== socket.id,
    );

    this.statusService.add(user.id.toString(), 'connected');
    return { success: true, message: 'User disconnected' };
  }

  // ---------------------------------  PRIVATE METHODS  -------------------------------- //

  // Method to create a new Pong session
  private async createPong(
    gameId: string,
    userId: number,
    socket: Socket,
  ): Promise<any> {
    let pong: Pong = this.pongOnGoing.get(gameId);
    if (pong) {
      this.logger.error(`Game with ID ${gameId} already exists`, 'createPong');
      return;
    }
    try {
      const game: Game = await this.gameService.getGameById(gameId);
      const score: ScoreInfo = await this.scoreService.getScoreByGameId(
        game.id,
      );
      pong = new Pong(
        this.server,
        gameId,
        game,
        this.gameService,
        this.scoreService,
        this.statsService,
        this.statusService,
        this.logger,
        score,
      );
      await pong.initPlayer();
      this.pongOnGoing.set(gameId, pong);
      return this.joinGame(gameId, userId, socket);
    } catch (error) {
      this.logger.error(
        `Error while creating Pong Session: ${error.message}`,
        'createPong',
        error,
      );
      return;
    }
  }

  private checkConnexion(): void {
    this.usersConnected.forEach((user) => {
      if (
        (user.isPlayer && user.pingSend >= PLAYER_PING) ||
        (!user.isPlayer && user.pingSend >= SPECTATOR_PING)
      ) {
        this.logger.log(`User with ID ${user.id} disconnected`);
        this.disconnect(user.id, user.socket, false);
      } else {
        user.sendPing();
      }
    });
  }
}
