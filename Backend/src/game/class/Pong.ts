import { Server } from 'socket.io';
import { GameData } from '@Shared/types/Game.types';
import { Injectable } from '@nestjs/common';
import { ActionDTO } from '../dto/Action.dto';
import { UserInfo } from './UserInfo';

Injectable();
export class Pong {
  // -----------------------------------  VARIABLE  ----------------------------------- //
  private playerLeft: UserInfo | null = null;
  private playerRight: UserInfo | null = null;
  private spectators: UserInfo[] = [];
  public gameData: GameData;

  // ----------------------------------  CONSTRUCTOR  --------------------------------- //

  constructor(
    private readonly server: Server,
    public readonly uuid: string,
    data: GameData,
  ) {
    this.gameData = data;
    console.log('Pong created');
  }

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  public async join(user: UserInfo): Promise<any> {
    let returnData;
    if (user.id === this.gameData.playerLeft.id) {
      if (this.playerLeft) {
        returnData = {
          success: false,
          message: 'Player already joined',
        };
        return returnData;
      }
      this.playerLeft = user;
      // update game
    } else if (user.id === this.gameData.playerRight.id) {
      if (this.playerRight) {
        returnData = {
          success: false,
          message: 'Player already joined',
        };
        return returnData;
      }
      this.playerRight = user;
      // update game
    } else {
      this.spectators.push(user);
    }
    user.socket.join(this.uuid);
    returnData = {
      success: true,
      message: 'User have joined the game',
    };
    return returnData;
  }

  public async playerAction(userId: number, action: ActionDTO): Promise<any> {
    if (this.playerLeft && this.playerLeft.id === userId) {
      this.server
        .to(this.uuid)
        .emit(
          'update',
          `Action ${action.action} has been performed by left player with id: ${userId}`,
        );
    } else if (userId === this.gameData.playerRight.id) {
      this.server
        .to(this.uuid)
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
    user.socket.leave(this.uuid);
    const returnData = {
      success: true,
      message: 'User have left the game',
    };
    return returnData;
  }

  // ---------------------------------  PRIVATE METHODS  -------------------------------- //
}
