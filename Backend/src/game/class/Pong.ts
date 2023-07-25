// import standard nest packages
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

// import game types
import { ActionDTO } from '../dto/Action.dto';
import { GameData, Ball, Score } from '@Shared/types/Game.types';

// import game classes
import { UserInfo } from './UserInfo';

// import entities
import { Game } from '@/utils/typeorm/Game.entity';

// import constants
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  BALL_SIZE,
} from '@Shared/constants/Game.constants';

// import services
import { UsersService } from '@/users/users.service';
import { GameService } from '../service/game.service';
import ColoredLogger from '../colored-logger';

Injectable();
export class Pong {
  // -----------------------------------  VARIABLE  ----------------------------------- //
  private playerLeft: UserInfo | null = null;
  private playerRight: UserInfo | null = null;
  private spectators: UserInfo[] = [];
  private data: GameData;
  private readonly logger = new ColoredLogger();

  // ----------------------------------  CONSTRUCTOR  --------------------------------- //

  constructor(
    private readonly server: Server,
    public readonly gameId: string,
    private readonly gameDB: Game,
    private readonly gameService: GameService,
  ) {
    this.initGame();
  }

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  public async join(user: UserInfo, usersService: UsersService): Promise<any> {
    const data: ReturnData = {
      success: false,
      message: '',
    };

    // Update gameDB if opponent is not set
    if (this.gameDB.opponent === -1) {
      try {
        this.gameDB.opponent = await this.gameService.checkOpponent(
          this.gameDB.uuid,
        );
      } catch (error) {
        this.logger.error('Error Updating game opponent', 'Pong - Join', error);
        throw new WsException('Error while updating game opponent');
      }
    }

    if (user.id === this.gameDB.host || user.id === this.gameDB.opponent) {
      try {
        await this.joinAsPlayer(user, usersService);
        this.logger.log(
          `User ${user.id} joined ${this.gameId} as ${
            user.id === this.gameDB.host ? 'Host' : 'Opponent'
          }`,
          'Pong - Join',
        );
      } catch (error) {
        this.logger.error('Error Joining as player', 'Pong - Join', error);
        throw new WsException('Error while joining as player');
      }
    } else {
      this.spectators.push(user);
      this.logger.log(
        `User ${user.id} joined ${this.gameId} as Spectator`,
        'Pong - Join',
      );
    }

    user.socket.join(this.gameId);
    data.success = true;
    data.message = 'User joined game';
    data.data = this.data;
    return data;
  }

  public async playerAction(userId: number, action: ActionDTO): Promise<any> {
    if (this.playerLeft && this.playerLeft.id === userId) {
      this.server
        .to(this.gameId)
        .emit(
          'update',
          `Action ${action.action} has been performed by left player with id: ${userId}`,
        );
    } else if (this.playerRight && this.playerRight.id === userId) {
      this.server
        .to(this.gameId)
        .emit(
          'update',
          `Action ${action.action} has been performed by right player with id: ${userId}`,
        );
    } else {
      throw new WsException('Action not performed by player');
    }
  }

  public async disconnect(user: UserInfo): Promise<any> {
    const data: ReturnData = {
      success: false,
      message: '',
    };
    if (this.playerLeft && this.playerLeft === user) {
      this.playerLeft = null;
      // update game
    } else if (this.playerRight && this.playerRight === user) {
      this.playerRight = null;
      // update game
    } else {
      if (this.spectators.length === 0) {
        data.message = 'No spectators in the game';
        return data;
      }
      this.spectators = this.spectators.filter(
        (spectator) => spectator !== user,
      );
    }
    user.socket.leave(this.gameId);
    data.success = true;
    data.message = 'User disconnected from game';
    return data;
  }

  // ---------------------------------  PRIVATE METHODS  -------------------------------- //

  /**
   * Method to initialize the game data.
   */
  private initGame(): void {
    if (this.gameDB) {
      this.data = {
        id: this.gameDB.uuid,
        name: this.gameDB.name,
        ball: this.initBall(),
        playerLeft: null,
        playerRight: null,
        background: this.gameDB.background,
        type: this.gameDB.type,
        mode: this.gameDB.mode,
        difficulty: this.gameDB.difficulty,
        push: this.gameDB.push,
        fontColor: { r: 255, g: 255, b: 255 },
        roundColor: { r: 255, g: 255, b: 255 },
        roundWinColor: { r: 255, g: 255, b: 255 },
        playerServe: null,
        actualRound: 0,
        maxPoint: this.gameDB.maxPoint,
        maxRound: this.gameDB.maxRound,
        score: this.initScore(),
        timer: null,
        status: 'Waiting',
        result: 'Not Started',
      };
    }
  }

  private initBall(): Ball {
    return {
      img: this.gameDB.ball,
      color: null,
      posX: GAME_WIDTH / 2 - BALL_SIZE / 2,
      posY: GAME_HEIGHT / 2 - BALL_SIZE / 2,
      speed: 0,
      moveX: 0,
      moveY: 0,
      push: 0,
    };
  }

  private initScore(): Score {
    return {
      hostRoundWon: 0,
      opponentRoundWon: 0,
      round: [
        { host: 0, opponent: 0 },
        { host: 0, opponent: 0 },
        { host: 0, opponent: 0 },
        { host: 0, opponent: 0 },
        { host: 0, opponent: 0 },
        { host: 0, opponent: 0 },
        { host: 0, opponent: 0 },
        { host: 0, opponent: 0 },
        { host: 0, opponent: 0 },
      ],
    };
  }

  private async joinAsPlayer(user: UserInfo, usersService: UsersService) {
    if (user.id === this.gameDB.host && this.gameDB.hostSide === 'Left') {
      this.playerLeft = user;
      if (!this.data.playerLeft) {
        const player = await this.gameService.definePlayer(
          user.id,
          usersService,
          'Left',
        );
        this.data.playerLeft = player;
      } else this.data.playerLeft.status = 'Connected';
    } else if (
      user.id === this.gameDB.host &&
      this.gameDB.hostSide === 'Right'
    ) {
      this.playerRight = user;
      if (!this.data.playerRight) {
        const player = await this.gameService.definePlayer(
          user.id,
          usersService,
          'Right',
        );
        this.data.playerRight = player;
      } else this.data.playerRight.status = 'Connected';
    } else if (
      user.id === this.gameDB.opponent &&
      this.gameDB.hostSide === 'Left'
    ) {
      this.playerRight = user;
      if (!this.data.playerRight) {
        const player = await this.gameService.definePlayer(
          user.id,
          usersService,
          'Right',
        );
        this.data.playerRight = player;
      }
    } else if (
      user.id === this.gameDB.opponent &&
      this.gameDB.hostSide === 'Right'
    ) {
      this.playerLeft = user;
      if (!this.data.playerLeft) {
        const player = await this.gameService.definePlayer(
          user.id,
          usersService,
          'Left',
        );
        this.data.playerLeft = player;
      }
    }
  }
}
