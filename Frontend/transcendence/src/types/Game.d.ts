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

type GameInfos = {
  uuid: string;
  Name: string;
  Host: number;
  Opponent: number;
  Viewers_List: number;
  Score_Host: number;
  Score_Opponent: number;
  Status: string;
  CreatedAt: string;
  Winner: number;
  Loser: number;
  Push: boolean;
  Score: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  Round: 1 | 3 | 5 | 7 | 9;
  Side: "left" | "right";
  Background: string;
  Ball: string;
  Paddle: string;
  Type: string;
  Mode: string;
};

type Game_Settings = {
  name: string;
  push: boolean;
  score: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  round: 1 | 3 | 5 | 7 | 9;
  side: "left" | "right";
  background: string;
  ball: string;
  type: string;
  mode: string;
};
