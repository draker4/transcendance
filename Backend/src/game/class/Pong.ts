import { Server } from 'socket.io';
import { LobbyService } from 'src/lobby/lobby-service/lobby.service';
import { GameData } from 'src/utils/types/game.types';
import { Injectable } from '@nestjs/common';

Injectable();
export class Pong {
  // -----------------------------------  VARIABLE  ----------------------------------- //
  public readonly createdAt: Date = new Date();
  private hostSocket: number | null = null;
  private opponentSocket: number | null = null;
  private spectator: Set<number> = new Set<number>();
  private readonly lobbyService: LobbyService;
  public readonly gameData: GameData;

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

  public joinPlayer(userId: number): void {
    if (userId === this.gameData.host) {
      this.hostSocket = userId;
    } else {
      this.opponentSocket = userId;
    }
  }

  public joinSpectator(userId: number): void {
    this.spectator.add(userId);
  }

  public disconnect(userId: number): void {
    // find if user is host, opponent or spectator
    if (userId === this.gameData.host) {
      this.hostSocket = null;
    } else if (userId === this.gameData.opponent) {
      this.opponentSocket = null;
    } else {
      this.spectator.delete(userId);
    }
  }
  // ---------------------------------  PRIVATE METHODS  -------------------------------- //
}
