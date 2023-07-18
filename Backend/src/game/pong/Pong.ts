import { GameData } from 'src/utils/types/game.types';

export class Pong {
  // -----------------------------------  VARIABLE  ----------------------------------- //
  width: number;
  height: number;
  // ball: Ball;
  // playerLeft: Player;
  // playerRight: Player;
  playerSide: 'left' | 'right';
  playerServe: 'left' | 'right' | null;
  result: string;
  round: number;
  roundPoint: number;
  roundMax: number;
  timer: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  startTimer: number;
  running: boolean;
  over: boolean;
  AI: boolean;
  push: boolean;

  // ----------------------------------  CONSTRUCTOR  --------------------------------- //

  constructor(GameData: GameData) {
    // get both user data from database
  }
  // -----------------------------------  METHODS  ------------------------------------ //
}
