import { Socket } from 'socket.io';
import { ColoredLogger } from '../colored-logger';
import {
  PLAYER_HEARTBEAT,
  SPECTATOR_HEARTBEAT,
} from '@Shared/constants/Game.constants';

export class UserInfo {
  public pingSend = 0;
  public lastPing = 0;
  private pingTimings = 0;
  private readonly logger: ColoredLogger;

  constructor(
    public id: number,
    public socket: Socket,
    public gameId: string,
    public isPlayer: boolean,
  ) {
    this.logger = new ColoredLogger(UserInfo.name);
  }

  public initUser(): void {
    this.pingTimings = this.isPlayer ? PLAYER_HEARTBEAT : SPECTATOR_HEARTBEAT;
  }

  public sendPing(): void {
    this.socket.emit('ping');
    this.pingSend++;
  }
}
