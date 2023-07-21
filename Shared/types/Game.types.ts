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

export type Timer = {
  reason: "Start" | "Round" | "Pause" | "Waiting";
  time: number;
};

export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type Player = {
  // Fixed Data
  id: number;
  name: string;
  color: string; // attention si couleur du player = couleur du background
  side: "Left" | "Right";

  // Dynamic Data
  posX: number;
  posY: number;
  speed: number;
  move: Action;
  push: number;
  status: "Connected" | "Playing" | "Paused" | "Disconnected";
};

export type Ball = {
  // Fixed Data
  img: string | null;
  color: string | null; // utiliser uniquement si img = null et faire attention si couleur du ball = couleur du background

  // Dynamic Data
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
  playerLeft: Player | null;
  playerRight: Player | null;
  background: string;
  type: "Classic" | "Best3" | "Best5" | "Custom" | "Training";
  mode: "League" | "Party" | "Training";
  difficulty: 1 | 2 | 3 | 4 | 5;
  push: boolean;
  fontColor: RGB;
  roundColor: RGB;
  roundWinColor: RGB;

  // Dynamic Data
  playerServe: "Left" | "Right" | null;
  actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  maxRound: 1 | 3 | 5 | 7 | 9;
  score: Score | null;
  timer: Timer;
  status: "Waiting" | "Playing" | "Finished" | "Deleted";
  result:
    | "Not Started"
    | "On Going"
    | "Draw"
    | "Player1"
    | "Player2"
    | "Deleted";
};
