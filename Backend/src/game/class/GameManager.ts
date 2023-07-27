// import standard nest packages
import { Server, Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
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
} from '@Shared/constants/Game.constants';

// import services
import { GameService } from '../service/game.service';
import { UsersService } from '@/users/users.service';
import { ColoredLogger } from '../colored-logger';

@Injectable()
export class GameManager {
  // -----------------------------------  VARIABLES  ----------------------------------- //
  private readonly pongOnGoing: Map<string, Pong> = new Map<string, Pong>();
  private usersConnected: UserInfo[] = [];
  private server: Server;

  // ----------------------------------  CONSTRUCTOR  --------------------------------- //

  constructor(
    private readonly gameService: GameService,
    private readonly usersService: UsersService,
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
    // If Pong Session doesn't exist, create it
    if (!game) {
      try {
        return this.createPong(gameId, userId, socket);
      } catch (error) {
        this.logger.error(
          `Can't create Pong Session: ${error.message}`,
          'joinGame',
          error,
        ); // Use 'joinGame' as the context for this log message
        throw new WsException("Can't create Pong Session");
      }
    }

    let user = this.usersConnected.find(
      (user) => user.id === userId && user.socket.id === socket.id,
    );
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
      throw new WsException('Error while joining game');
    }
  }

  // Method to handle player actions in the game
  public async playerAction(action: ActionDTO, socket: Socket): Promise<any> {
    const pong = this.pongOnGoing.get(action.gameId);
    if (!pong) {
      throw new WsException('Game not found');
    }
    const user = this.usersConnected.find(
      (user) => user.id === action.userId && user.socket.id === socket.id,
    );
    if (!user) {
      throw new WsException('User not found');
    }
    user.pingSend = 0;
    this.logger.log(
      `User with ID ${action.userId} performed action ${action.action}`,
      'playerAction',
    );
    return pong.playerAction(action);
  }

  // Method to handle user updating their heartbeat to stay connected
  public updatePong(userId: number, socket: Socket): void {
    const user = this.usersConnected.find(
      (user) => user.id === userId && user.socket.id === socket.id,
    );
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`, 'updatePong');
      throw new WsException('User not found');
    }
    user.pingSend = 0;
    this.logger.log(`User with ID ${userId} Pong`, 'updatePong');
  }

  // Method to handle user disconnection from a game
  public async disconnect(userId: number, socket: Socket): Promise<any> {
    try {
      // Find user in the collection based on userId and socketId
      const user = this.usersConnected.find(
        (user) => user.id === userId && user.socket.id === socket.id,
      );
      if (!user) {
        // throw new WsException('User already disconnected');
        return;
      }

      //Find the game linked to the user
      const pong = this.pongOnGoing.get(user.gameId);
      if (!pong) {
        // throw new WsException('The game does not exist');
        return;
      }

      // Remove the user from the game and userConnected array
      await pong.disconnect(user);
      this.usersConnected = this.usersConnected.filter(
        (user) => user.id !== userId && user.socket.id !== socket.id,
      );

      return { success: true, message: 'User disconnected' };
    } catch (error) {
      this.logger.error(
        `Error while disconnecting user: ${error.message}`,
        'Manager - disconnect',
        error,
      );
      throw new WsException('Error while disconnecting user');
    }
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
      throw new WsException('Game already exists');
    }
    try {
      const game: Game = await this.gameService.getGameData(gameId);
      pong = new Pong(
        this.server,
        gameId,
        game,
        this.gameService,
        this.usersService,
        this.logger,
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
      throw new WsException('Error while creating Pong Session');
    }
  }

  private checkConnexion(): void {
    this.usersConnected.forEach((user) => {
      if (
        (user.isPlayer && user.pingSend >= PLAYER_PING) ||
        (!user.isPlayer && user.pingSend >= SPECTATOR_PING)
      ) {
        this.logger.log(`User with ID ${user.id} disconnected`);
        this.disconnect(user.id, user.socket).catch((error) => {
          this.logger.error(
            `Error while disconnecting user: ${error.message}`,
            'checkConnexion',
            error,
          );
        });
      } else {
        this.logger.log(
          `Ping sent to user: ${user.id} and socket id: ${user.socket.id}`,
          'checkConnexion',
        );
        user.sendPing();
      }
    });
  }
}
