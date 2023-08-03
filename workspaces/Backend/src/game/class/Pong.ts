// import standard nest packages
import { Server } from 'socket.io';
import { WsException } from '@nestjs/websockets';

// import game engine logic
import { ActionDTO } from '../dto/Action.dto';
import {
  GameData,
  Player,
  InitData,
} from '@transcendence/shared/types/Game.types';
import {
  StatusMessage,
  UpdateData,
} from '@transcendence/shared/types/Message.types';
import { defineTimer } from '@transcendence/shared/game/pongUtils';
import { initPong } from '@transcendence/shared/game/initPong';

// import classes and entities
import { UserInfo } from './UserInfo';
import { Game } from '@/utils/typeorm/Game.entity';

// import services
import { GameService } from '../service/game.service';
import { ScoreService } from '@/score/service/score.service';
import { ColoredLogger } from '../colored-logger';

import { ScoreInfo } from '@transcendence/shared/types/Score.types';

import { updatePong } from '@transcendence/shared/game/updatePong';

import {
  BACK_FPS,
  TIMER_DECONNECTION,
  TIMER_PAUSE,
  TIMER_RESTART,
  TIMER_START,
} from '@transcendence/shared/constants/Game.constants';

export class Pong {
  // Game Loop variables
  private lastTimestamp: number = 0;
  private isGameLoopRunning: boolean = false;
  private framesThisSecond = 0;
  private lastFpsUpdate = 0;
  private currentFps = 0;
  private updateGameInterval: NodeJS.Timeout | null = null;

  // Game data
  private playerLeft: UserInfo | null = null;
  private playerRight: UserInfo | null = null;
  private spectators: UserInfo[] = [];
  private data: GameData;

  constructor(
    private readonly server: Server,
    public readonly gameId: string,
    private readonly gameDB: Game,
    private readonly gameService: GameService,
    private readonly scoreService: ScoreService,
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
      this.data.playerLeft = await this.gameService.definePlayer(
        this.gameDB.hostSide === 'Left'
          ? this.gameDB.host
          : this.gameDB.opponent,
        'Left',
        this.gameDB.hostSide === 'Left',
      );
      this.data.playerLeftStatus = 'Disconnected';
      this.data.playerRight = await this.gameService.definePlayer(
        this.gameDB.hostSide === 'Right'
          ? this.gameDB.host
          : this.gameDB.opponent,
        'Right',
        this.gameDB.hostSide === 'Right',
      );
      this.data.playerRightStatus = 'Disconnected';
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
    if (
      this.playerLeft.id === action.userId ||
      this.playerRight.id === action.userId
    ) {
      if (action.move === 'Stop') {
        if (this.data.status === 'Playing') {
          this.data.status = 'Stopped';
          this.data.sendStatus = true;
          this.data.timer = defineTimer(
            TIMER_PAUSE,
            'Pause',
            this.playerLeft.id === action.userId
              ? this.data.playerLeft.name
              : this.data.playerRight.name,
          );
        } else if (this.data.status === 'Stopped') {
          this.data.status = 'Playing';
          this.data.sendStatus = true;
          this.data.timer = defineTimer(
            TIMER_RESTART,
            'ReStart',
            this.playerLeft.id === action.userId
              ? this.data.playerLeft.name
              : this.data.playerRight.name,
          );
        }
      } else if (action.move === 'Push') {
        if (
          this.playerLeft.id === action.userId &&
          !this.data.playerLeftDynamic.push
        )
          this.data.playerLeftDynamic.push = 1;
        else if (
          this.playerRight.id === action.userId &&
          !this.data.playerRightDynamic.push
        )
          this.data.playerRightDynamic.push = 1;
      } else {
        if (this.playerLeft.id === action.userId)
          this.data.playerLeftDynamic.move = action.move;
        else if (this.playerRight.id === action.userId)
          this.data.playerRightDynamic.move = action.move;
      }
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
      this.stopGameLoop();
    } else if (this.playerRight && this.playerRight === user) {
      this.playerRight = null;
      this.disconnectPlayer('Right');
      this.stopGameLoop();
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
  }

  private sendUpdate() {
    const update: UpdateData = {
      playerLeftDynamic: this.data.playerLeftDynamic,
      playerRightDynamic: this.data.playerRightDynamic,
      ball: this.data.ball,
      score: this.data.score,
      actualRound: this.data.actualRound,
    };
    this.server.to(this.gameId).emit('update', update);
  }

  // ---------------------------------  LOOP METHODS  --------------------------------- //

  private startGameLoop() {
    if (!this.isGameLoopRunning) {
      this.isGameLoopRunning = true;
      this.lastTimestamp = performance.now();
      this.updateGameInterval = setInterval(() => this.gameLoop(), BACK_FPS);
    }
  }

  private gameLoop() {
    const timestamp = performance.now();
    this.lastTimestamp = timestamp;

    if (this.data.status === 'Playing') {
      updatePong(this.data);
      this.sendUpdate();
      if (this.data.updateScore) {
        this.updateDBScore();
        this.data.updateScore = false;
      }
    }
    if (this.data.sendStatus) {
      this.updateDBStatus();
      this.sendStatus();
      this.data.sendStatus = false;
    }

    // Calculate FPS
    this.framesThisSecond++;
    if (timestamp > this.lastFpsUpdate + 1000) {
      this.currentFps = this.framesThisSecond;
      this.framesThisSecond = 0;
      this.lastFpsUpdate = timestamp;
    }
  }

  private stopGameLoop() {
    this.isGameLoopRunning = false;
    if (this.updateGameInterval) {
      clearTimeout(this.updateGameInterval);
      this.updateGameInterval = null;
    }
  }

  // -------------------------------  UPDATE DB METHODS  ------------------------------ //

  private async updateDBScore() {
    try {
      if (
        this.data.actualRound > 0 &&
        this.data.score.round[this.data.actualRound].left === 0 &&
        this.data.score.round[this.data.actualRound].right === 0
      ) {
        this.scoreService.updateScore(
          this.gameId,
          this.data.score,
          this.data.actualRound,
          true,
        );
      } else {
        this.scoreService.updateScore(
          this.gameId,
          this.data.score,
          this.data.actualRound,
          false,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error Updating Score: ${error.message}`,
        'Pong - updateDBScore',
        error,
      );
    }
  }

  private async updateDBStatus() {
    try {
      this.gameService.updateStatus(
        this.gameId,
        this.data.status,
        this.data.result,
        this.data.actualRound,
      );
    } catch (error) {
      this.logger.error(
        `Error Updating Status: ${error.message}`,
        'Pong - updateDBStatus',
        error,
      );
    }
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
      if (this.data.playerRight.id === -1) {
        this.data.playerRight = await this.gameService.definePlayer(
          user.id,
          'Right',
          false,
        );
        this.sendPlayerData(this.data.playerRight);
      }
      this.data.playerRightStatus = 'Connected';
    } else if (this.gameDB.hostSide === 'Right') {
      this.playerLeft = user;
      if (this.data.playerLeft.id === -1) {
        this.data.playerLeft = await this.gameService.definePlayer(
          user.id,
          'Left',
          false,
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
        this.data.sendStatus = true;
        this.startGameLoop();
        this.data.timer = defineTimer(TIMER_START, 'Start');
      } else if (this.data.status === 'Stopped') {
        this.data.status = 'Playing';
        this.data.sendStatus = true;
        this.startGameLoop();
        this.data.timer = defineTimer(TIMER_RESTART, 'ReStart');
      }
    }
  }

  private disconnectPlayer(side: 'Left' | 'Right') {
    if (side === 'Left') {
      this.data.playerLeftStatus = 'Disconnected';
      if (this.data.status === 'Playing') {
        this.data.status = 'Stopped';
        this.data.sendStatus = true;
        this.data.timer = defineTimer(
          TIMER_DECONNECTION,
          'Deconnection',
          this.data.playerLeft.name,
        );
      }
    } else if (side === 'Right') {
      this.data.playerRightStatus = 'Disconnected';
      if (this.data.status === 'Playing') {
        this.data.status = 'Stopped';
        this.data.sendStatus = true;
        this.data.timer = defineTimer(
          TIMER_DECONNECTION,
          'Deconnection',
          this.data.playerRight.name,
        );
      }
    }
  }
}
