import { Socket } from 'socket.io';

export class UserInfo {
  // -----------------------------------  VARIABLE  ----------------------------------- //

  // ----------------------------------  CONSTRUCTOR  --------------------------------- //
  constructor(
    public id: number,
    public socket: Socket,
    public gameId: string,
  ) {}

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  // --------------------------------  PRIVATE METHODS  ------------------------------- //
}
