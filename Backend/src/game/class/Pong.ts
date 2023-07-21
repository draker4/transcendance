// import standard nest packages
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

// import game types
import { ActionDTO } from '../dto/Action.dto';
import { Action, GameData, Player } from '@Shared/types/Game.types';

// import game classes
import { UserInfo } from './UserInfo';

// import entities
import { Game } from '@/utils/typeorm/Game.entity';

// import constants
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  BALL_SIZE,
  PLAYER_START_SPEED,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
} from '@Shared/constants/game.constants';
import { UsersService } from '@/users/users.service';

Injectable();
export class Pong {
  // -----------------------------------  VARIABLE  ----------------------------------- //
  private playerLeft: UserInfo | null = null;
  private playerRight: UserInfo | null = null;
  private spectators: UserInfo[] = [];
  private data: GameData;

  // ----------------------------------  CONSTRUCTOR  --------------------------------- //

  constructor(
    private readonly server: Server,
    public readonly gameId: string,
    private readonly gameDB: Game,
  ) {
    if (gameDB) {
      this.data = {
        id: gameDB.uuid,
        name: gameDB.name,
        ball: {
          img: gameDB.ball,
          color: null,
          posX: GAME_WIDTH / 2 - BALL_SIZE / 2,
          posY: GAME_HEIGHT / 2 - BALL_SIZE / 2,
          speed: 0,
          moveX: 0,
          moveY: 0,
          push: 0,
        },
        playerLeft: null,
        playerRight: null,
        background: gameDB.background,
        type: gameDB.type,
        mode: gameDB.mode,
        difficulty: gameDB.difficulty,
        push: gameDB.push,
        fontColor: { r: 255, g: 255, b: 255 },
        roundColor: { r: 255, g: 255, b: 255 },
        roundWinColor: { r: 255, g: 255, b: 255 },
        playerServe: null,
        actualRound: 0,
        maxPoint: gameDB.maxPoint,
        maxRound: gameDB.maxRound,
        score: {
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
        },
        timer: {
          reason: 'Start',
          time: 0,
        },
        status: 'Waiting',
        result: 'Not Started',
      };
    }
    console.log('Pong created' + JSON.stringify(this.data));
  }

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  public async join(user: UserInfo, usersService: UsersService): Promise<any> {
    if (user.id === this.gameDB.host || user.id === this.gameDB.opponent) {
      this.joinAsPlayer(user, usersService);
      // update game
    } else {
      this.spectators.push(user);
    }
    user.socket.join(this.gameId);
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
      const Data = {
        success: false,
        message: 'Action not performed by player',
      };
      return Data;
    }
  }

  public async disconnect(user: UserInfo): Promise<any> {
    if (this.playerLeft && this.playerLeft === user) {
      this.playerLeft = null;
      // update game
    } else if (this.playerRight && this.playerRight === user) {
      this.playerRight = null;
      // update game
    } else {
      this.spectators = this.spectators.filter(
        (spectator) => spectator !== user,
      );
    }
    user.socket.leave(this.gameId);
    const returnData = {
      success: true,
      message: 'User have left the game',
    };
    return returnData;
  }

  // ---------------------------------  PRIVATE METHODS  -------------------------------- //

  private async definePlayer(
    userId: number,
    usersService: UsersService,
    side: 'Left' | 'Right',
  ): Promise<Player> {
    try {
      const user = await usersService.getUserById(userId);
      const player: Player = {
        id: userId,
        name: user.login,
        color: user.avatar.backgroundColor,
        side: side,
        posX:
          side === 'Left' ? PLAYER_WIDTH * 3 : GAME_WIDTH - PLAYER_WIDTH * 4,
        posY: GAME_HEIGHT / 2 - PLAYER_HEIGHT / 2,
        speed: PLAYER_START_SPEED,
        move: Action.Idle,
        push: 0,
        status: 'Connected',
      };
      return player;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private async joinAsPlayer(user: UserInfo, usersService: UsersService) {
    if (user.id === this.gameDB.host) {
      if (this.gameDB.hostSide === 'Left') {
        this.playerLeft = user;
        if (!this.data.playerLeft) {
          this.data.playerLeft = await this.definePlayer(
            user.id,
            usersService,
            'Left',
          );
        } else this.data.playerLeft.status = 'Connected';
      } else {
        this.playerRight = user;
        if (!this.data.playerRight) {
          this.data.playerRight = await this.definePlayer(
            user.id,
            usersService,
            'Right',
          );
        } else this.data.playerRight.status = 'Connected';
      }
    } else if (user.id === this.gameDB.opponent) {
      if (this.gameDB.hostSide === 'Left') {
        this.playerRight = user;
        if (!this.data.playerRight) {
          this.data.playerRight = await this.definePlayer(
            user.id,
            usersService,
            'Right',
          );
        } else this.data.playerRight.status = 'Connected';
      } else {
        this.playerLeft = user;
        if (!this.data.playerLeft) {
          this.data.playerLeft = await this.definePlayer(
            user.id,
            usersService,
            'Left',
          );
        } else this.data.playerLeft.status = 'Connected';
      }
    }
  }
}
