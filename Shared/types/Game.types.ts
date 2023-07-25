export enum Action {
  Idle,
  Up,
  Down,
  Left,
  Right,
  Push,
  Stop,
}

export enum DirX {
  Left = -1,
  Idle = 0,
  Right = 1,
}

export enum DirY {
  Up = -1,
  Idle = 0,
  Down = 1,
}

export type RoundScore = {
  host: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  opponent: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

export type Score = {
  hostRoundWon: 0 | 1 | 2 | 3 | 4 | 5;
  opponentRoundWon: 0 | 1 | 2 | 3 | 4 | 5;
  round: RoundScore[];
};

export type StatusMessage = {
  status: "Waiting" | "Playing" | "Finished" | "Deleted";
  result:
    | "Not Started"
    | "On Going"
    | "Draw"
    | "Player1"
    | "Player2"
    | "Deleted";
  playerLeft: "Unknown" | "Connected" | "Playing" | "Paused" | "Disconnected";
  playerRight: "Unknown" | "Connected" | "Playing" | "Paused" | "Disconnected";
  timer: Timer | null;
};

export type Timer = {
  reason: "Start" | "ReStart" | "Round" | "Pause" | "Waiting";
  start: Date;
  end: Date;
};

export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type Player = {
  id: number;
  name: string;
  color: RGB;
  side: "Left" | "Right";
};

export type PlayerDynamic = {
  posX: number;
  posY: number;
  speed: number;
  move: Action;
  push: number;
  status: "Unknown" | "Connected" | "Playing" | "Paused" | "Disconnected";
};

export type Ball = {
  img: string | null;
  color: string | null;
};

export type BallDynamic = {
  posX: number;
  posY: number;
  speed: number;
  moveX: number;
  moveY: number;
  push: number;
};

export type Draw = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
};

export type GameData = {
  // Fixed Data from Backend
  id: string;
  name: string;
  ball: Ball;
  ballDynamic: BallDynamic;
  playerLeft: Player | null;
  playerRight: Player | null;
  playerLeftDynamic: PlayerDynamic;
  playerRightDynamic: PlayerDynamic;
  background: string;
  type: "Classic" | "Best3" | "Best5" | "Custom" | "Training";
  mode: "League" | "Party" | "Training";
  difficulty: 1 | 2 | 3 | 4 | 5;
  push: boolean;
  fontColor: RGB;
  roundColor: RGB;
  roundWinColor: RGB;
  maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  maxRound: 1 | 3 | 5 | 7 | 9;

  // Dynamic Data
  playerServe: "Left" | "Right" | null;
  actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  score: Score | null;
  timer: Timer | null;
  status: "Waiting" | "Playing" | "Finished" | "Deleted";
  result:
    | "Not Started"
    | "On Going"
    | "Draw"
    | "Player1"
    | "Player2"
    | "Deleted";
};
