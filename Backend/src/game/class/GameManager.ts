// import standard nest packages
import { Server, Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';

// import game classes
import { Pong } from './Pong';
import { UserInfo } from './UserInfo';

// import services
import { GameService } from '../service/game.service';

// import DTOs
import { ActionDTO } from '../dto/Action.dto';

// import entities
import { Game } from '@/utils/typeorm/Game.entity';
import { UsersService } from '@/users/users.service';

import ColoredLogger from '../colored-logger';

@Injectable()
export class GameManager {
  // -----------------------------------  VARIABLES  ----------------------------------- //
  private readonly pongOnGoing: Map<string, Pong> = new Map<string, Pong>();
  private usersConnected: UserInfo[] = [];
  private server: Server;
  private readonly logger: ColoredLogger;

  // ----------------------------------  CONSTRUCTOR  --------------------------------- //

  constructor(
    private readonly gameService: GameService,
    private readonly usersService: UsersService,
  ) {
    this.logger = new ColoredLogger(GameManager.name); // Set the module name for the logger
  }

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  // Set the WebSocket server instance in the game manager to handle game-related functionality
  public setServer(server: Server): void {
    this.server = server;
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

    // Add the user to userInfo array
    const user = new UserInfo(userId, socket, gameId);
    this.usersConnected.push(user);
    return game.join(user);
  }

  // Method to handle player actions in the game
  public async playerAction(action: ActionDTO, userId: number): Promise<any> {
    const pong = this.pongOnGoing.get(action.gameId);
    if (!pong) {
      throw new WsException('Game not found');
    }
    return pong.playerAction(userId, action);
  }

  // Method to handle user disconnection from a game
  public async disconnect(userId: number, socket: Socket): Promise<any> {
    try {
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
        throw new WsException('Cannot find the actual game');
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
    try {
      const game: Game = await this.gameService.getGameData(gameId);
      const pong = new Pong(
        this.server,
        gameId,
        game,
        this.gameService,
        this.usersService,
      );
      await pong.initPlayer();
      this.pongOnGoing.set(gameId, pong);
      this.printPongSessions();
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

  // Method to print actual Pong sessions
  private printPongSessions(): void {
    this.logger.log(
      `Pong Sessions: ${Array.from(this.pongOnGoing.keys()).join(', ')}`,
      'printPongSessions',
    );
  }
}
