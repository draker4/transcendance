// import standard nest packages
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

// import game types
import { ActionDTO } from '../dto/Action.dto';
import {
  GameData,
  Ball,
  BallDynamic,
  Score,
  Player,
  PlayerDynamic,
  Timer,
  StatusMessage,
} from '@transcendence/shared/types/Game.types';

// import game classes
import { UserInfo } from './UserInfo';

// import entities
import { Game } from '@/utils/typeorm/Game.entity';

// import constants
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  BALL_SIZE,
  BALL_START_SPEED,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_START_SPEED,
} from '@transcendence/shared/constants/Game.constants';

// import services
import { UsersService } from '@/users/users.service';
import { GameService } from '../service/game.service';
import { ColoredLogger } from '../colored-logger';

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
    private readonly usersService: UsersService,
    private readonly logger: ColoredLogger,
  ) {
    this.initGame();
  }

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  public async initPlayer(): Promise<void> {
    try {
      if (this.gameDB.hostSide === 'Left') {
        this.data.playerLeft = await this.gameService.definePlayer(
          this.gameDB.host,
          this.usersService,
          'Left',
        );
        this.data.playerLeftStatus = 'Disconnected';
        if (this.gameDB.opponent !== -1) {
          this.data.playerRight = await this.gameService.definePlayer(
            this.gameDB.opponent,
            this.usersService,
            'Right',
          );
          this.data.playerRightStatus = 'Disconnected';
        }
      } else if (this.gameDB.hostSide === 'Right') {
        this.data.playerRight = await this.gameService.definePlayer(
          this.gameDB.host,
          this.usersService,
          'Right',
        );
        this.data.playerRightStatus = 'Disconnected';
        if (this.gameDB.opponent !== -1) {
          this.data.playerLeft = await this.gameService.definePlayer(
            this.gameDB.opponent,
            this.usersService,
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
          this.gameDB.uuid,
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

  // ---------------------------------  INIT METHODS  --------------------------------- //
  private async initGame(): Promise<void> {
    if (this.gameDB) {
      this.data = {
        id: this.gameDB.uuid,
        name: this.gameDB.name,
        ball: this.initBall(),
        ballDynamic: this.initBallDynamic(),
        playerLeft: null,
        playerRight: null,
        playerLeftDynamic: this.initPlayerDynamic('Left'),
        playerRightDynamic: this.initPlayerDynamic('Right'),
        playerLeftStatus: 'Unknown',
        playerRightStatus: 'Unknown',
        background: this.gameDB.background,
        type: this.gameDB.type,
        mode: this.gameDB.mode,
        difficulty: this.gameDB.difficulty,
        push: this.gameDB.push,
        fontColor: { r: 255, g: 255, b: 255 },
        roundColor: { r: 255, g: 255, b: 255 },
        roundWinColor: { r: 255, g: 255, b: 255 },
        playerServe: 'Left', // revoir pour faire un random
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

  private initPlayerDynamic(side: 'Left' | 'Right'): PlayerDynamic {
    return {
      posX: side === 'Left' ? PLAYER_WIDTH * 3 : GAME_WIDTH - PLAYER_WIDTH * 4,
      posY: GAME_HEIGHT / 2 - PLAYER_HEIGHT / 2,
      speed: PLAYER_START_SPEED,
      move: 'Idle',
      push: 0,
    };
  }

  private initBallDynamic(): BallDynamic {
    return {
      posX: GAME_WIDTH / 2 - BALL_SIZE / 2,
      posY: GAME_HEIGHT / 2 - BALL_SIZE / 2,
      speed: BALL_START_SPEED,
      moveX: 0,
      moveY: 0,
      push: 0,
    };
  }

  private initBall(): Ball {
    return {
      img: this.gameDB.ball,
      color: { r: 255, g: 255, b: 255 },
    };
  }

  private initScore(): Score {
    return {
      leftRound: 0,
      rightRound: 0,
      round: [
        { left: 0, right: 0 },
        { left: 0, right: 0 },
        { left: 0, right: 0 },
        { left: 0, right: 0 },
        { left: 0, right: 0 },
        { left: 0, right: 0 },
        { left: 0, right: 0 },
        { left: 0, right: 0 },
        { left: 0, right: 0 },
      ],
    };
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
          this.usersService,
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
          this.usersService,
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
      if (this.data.result === 'Not Started') {
        this.data.status = 'Playing';
        this.data.result = 'On Going';
        this.data.timer = this.defineTimer(10, 'Start');
      } else if (this.data.result === 'On Going') {
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
        this.data.status = 'Waiting';
        this.data.timer = this.defineTimer(60, 'Deconnection');
      }
    } else if (side === 'Right') {
      this.data.playerRightStatus = 'Disconnected';
      if (this.data.status === 'Playing') {
        this.data.status = 'Waiting';
        this.data.timer = this.defineTimer(60, 'Deconnection');
      }
    }
    this.sendStatus();
  }
}
