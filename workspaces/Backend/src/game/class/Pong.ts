// import standard nest packages
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

// import game engine logic
import { ActionDTO } from '../dto/Action.dto';
import {
  GameData,
  Player,
  Timer,
  StatusMessage,
  InitData,
} from '@transcendence/shared/types/Game.types';
import { initPong } from '@transcendence/shared/game/initPong';

// import classes and entities
import { UserInfo } from './UserInfo';
import { Game } from '@/utils/typeorm/Game.entity';

// import services
import { GameService } from '../service/game.service';
import { ColoredLogger } from '../colored-logger';

import { ScoreInfo } from '@transcendence/shared/types/Score.types';

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
    private readonly gameService: GameService,
    private readonly logger: ColoredLogger,
    score: ScoreInfo,
  ) {
    if (this.gameDB) {
      const initData: InitData = {
        id: this.gameDB.id,
        name: this.gameDB.name,
        type: this.gameDB.type,
        mode: this.gameDB.mode,
        maxPoint: this.gameDB.maxPoint,
        maxRound: this.gameDB.maxRound,
        difficulty: this.gameDB.difficulty,
        push: this.gameDB.push,
        background: this.gameDB.background,
        ball: this.gameDB.ball,
        score: score,
      };
      this.data = initPong(initData);
    }
  }

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  public async initPlayer(): Promise<void> {
    try {
      if (this.gameDB.hostSide === 'Left') {
        this.data.playerLeft = await this.gameService.definePlayer(
          this.gameDB.host,
          'Left',
        );
        this.data.playerLeftStatus = 'Disconnected';
        if (this.gameDB.opponent !== -1) {
          this.data.playerRight = await this.gameService.definePlayer(
            this.gameDB.opponent,
            'Right',
          );
          this.data.playerRightStatus = 'Disconnected';
        }
      } else if (this.gameDB.hostSide === 'Right') {
        this.data.playerRight = await this.gameService.definePlayer(
          this.gameDB.host,
          'Right',
        );
        this.data.playerRightStatus = 'Disconnected';
        if (this.gameDB.opponent !== -1) {
          this.data.playerLeft = await this.gameService.definePlayer(
            this.gameDB.opponent,
            'Left',
          );
          this.data.playerLeftStatus = 'Disconnected';
        }
      }
    } catch (error) {
      this.logger.error(
        `Error Initializing Players: ${error.message}`,
        'Pong - initPlayer',
        error,
      );
      throw new WsException('Error while initializing players');
    }
  }

  public async join(user: UserInfo): Promise<any> {
    const data: ReturnData = {
      success: false,
      message: '',
    };

    // Update gameDB if opponent is not set
    if (this.gameDB.opponent === -1) {
      try {
        this.gameDB.opponent = await this.gameService.checkOpponent(
          this.gameDB.id,
        );
      } catch (error) {
        this.logger.error(
          `Error Updating game opponent: ${error.message}`,
          'Pong - Join',
          error,
        );
        throw new WsException('Error while updating game opponent');
      }
    }

    if (user.id === this.gameDB.host || user.id === this.gameDB.opponent) {
      try {
        await this.joinAsPlayer(user);
        this.logger.log(
          `User ${user.id} joined ${this.gameId} as ${
            user.id === this.gameDB.host ? 'Host' : 'Opponent'
          }`,
          'Pong - Join',
        );
      } catch (error) {
        this.logger.error(
          `Error Joining as player: ${error.message}`,
          'Pong - Join',
          error,
        );
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

  public async playerAction(action: ActionDTO): Promise<any> {
    if (this.playerLeft && this.playerLeft.id === action.userId) {
      this.server
        .to(this.gameId)
        .emit(
          'update',
          `Action ${action.action} has been performed by left player with id: ${action.userId}`,
        );
    } else if (this.playerRight && this.playerRight.id === action.userId) {
      this.server
        .to(this.gameId)
        .emit(
          'update',
          `Action ${action.action} has been performed by right player with id: ${action.userId}`,
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
      this.disconnectPlayer('Left');
    } else if (this.playerRight && this.playerRight === user) {
      this.playerRight = null;
      this.disconnectPlayer('Right');
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

  // ---------------------------------  EMITS METHODS  -------------------------------- //

  private sendPlayerData(player: Player) {
    this.server.to(this.gameId).emit('player', player);
    this.logger.log("Player's data sent", 'Pong - sendPlayerDatas');
  }

  private sendStatus() {
    const status: StatusMessage = {
      status: this.data.status,
      result: this.data.result,
      playerLeft: this.data.playerLeftStatus,
      playerRight: this.data.playerRightStatus,
      timer: this.data.timer,
    };
    this.server.to(this.gameId).emit('status', status);
    this.logger.log('Status sent', 'Pong - sendStatus');
  }

  // ---------------------------------  OTHER METHODS  -------------------------------- //

  private async joinAsPlayer(user: UserInfo) {
    if (user.id === this.gameDB.host) {
      this.joinAsHost(user);
    } else if (user.id === this.gameDB.opponent) {
      try {
        await this.joinAsOpponent(user);
      } catch (error) {
        this.logger.error(
          `Error Joining as opponent: ${error.message}`,
          'Pong - JoinAsOpponent',
          error,
        );
        throw new WsException('Error while joining as opponent');
      }
    }
    this.updateStatus();
    this.sendStatus();
  }

  private joinAsHost(user: UserInfo) {
    user.isPlayer = true;
    if (this.gameDB.hostSide === 'Left') {
      this.playerLeft = user;
      this.data.playerLeftStatus = 'Connected';
    } else if (this.gameDB.hostSide === 'Right') {
      this.playerRight = user;
      this.data.playerRightStatus = 'Connected';
    }
  }

  private async joinAsOpponent(user: UserInfo) {
    user.isPlayer = true;
    if (this.gameDB.hostSide === 'Left') {
      this.playerRight = user;
      if (!this.data.playerRight) {
        this.data.playerRight = await this.gameService.definePlayer(
          user.id,
          'Right',
        );
        this.sendPlayerData(this.data.playerRight);
      }
      this.data.playerRightStatus = 'Connected';
    } else if (this.gameDB.hostSide === 'Right') {
      this.playerLeft = user;
      if (!this.data.playerLeft) {
        this.data.playerLeft = await this.gameService.definePlayer(
          user.id,
          'Left',
        );
        this.sendPlayerData(this.data.playerLeft);
      }
      this.data.playerLeftStatus = 'Connected';
    }
  }

  private updateStatus() {
    if (
      this.playerLeft &&
      this.data.playerLeftStatus === 'Connected' &&
      this.playerRight &&
      this.data.playerRightStatus === 'Connected'
    ) {
      if (this.data.status === 'Not Started') {
        this.data.status = 'Playing';
        this.data.timer = this.defineTimer(10, 'Start');
      } else if (this.data.status === 'Stopped') {
        this.data.status = 'Playing';
        this.data.timer = this.defineTimer(10, 'ReStart');
      }
    }
  }

  private defineTimer(
    second: number,
    reason: 'Start' | 'ReStart' | 'Round' | 'Pause' | 'Deconnection',
  ): Timer {
    return {
      start: new Date(),
      end: new Date(new Date().getTime() + second * 1000),
      reason: reason,
    };
  }

  private disconnectPlayer(side: 'Left' | 'Right') {
    if (side === 'Left') {
      this.data.playerLeftStatus = 'Disconnected';
      if (this.data.status === 'Playing') {
        this.data.status = 'Stopped';
        this.data.timer = this.defineTimer(60, 'Deconnection');
      }
    } else if (side === 'Right') {
      this.data.playerRightStatus = 'Disconnected';
      if (this.data.status === 'Playing') {
        this.data.status = 'Stopped';
        this.data.timer = this.defineTimer(60, 'Deconnection');
      }
    }
    this.sendStatus();
  }
}
