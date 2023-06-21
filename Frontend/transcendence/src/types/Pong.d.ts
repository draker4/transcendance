type Pos = {
  x: number;
  y: number;
};

type Player = {
  pos: Pos;
  width: number;
  height: number;
  speed: number;
  move: Direction;
  color: string;
  score: number;
  side: "left" | "right";
  push: number;
  roundWon: number;
};

type Ball = {
  pos: Pos;
  size: number;
  speed: number;
  moveX: number;
  moveY: number;
  color: string;
  push: number;
};

type Game = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  ball: Ball;
  playerLeft: Player;
  playerRight: Player;
  playerSide: "left" | "right";
  playerServe: "left" | "right" | null;
  color: string;
  fontColor: string;
  roundColor: string;
  roundWinColor: string;
  menuFont: string;
  scoreFont: string;
  timerFont: string;
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
};

type Pong = {
  AI: boolean;
  push: boolean;
  score: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  round: 1 | 3 | 5 | 7 | 9;
  difficulty: 1 | 2 | 3 | 4 | 5;
  side: "left" | "right";
};
