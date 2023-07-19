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
  side: "Left" | "Right";
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
  playerSide: "Left" | "Right";
  playerServe: "Left" | "Right" | null;
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

type GameSettings = {
  uuid: string;
  name: string;
  hostName: number;
  opponentName: number;
  push: boolean;
  maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  maxRound: 1 | 3 | 5 | 7 | 9;
  hostSide: "Left" | "Right";
  difficulty: 1 | 2 | 3 | 4 | 5;
  background: string;
  ball: string;
  type: string;
};
