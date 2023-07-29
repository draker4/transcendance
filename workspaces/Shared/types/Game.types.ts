export type Action =
  | "Idle"
  | "Up"
  | "Down"
  | "Left"
  | "Right"
  | "Push"
  | "Stop";

// Instead of enums, use type aliases and constants for DirX and DirY
export type DirX = -1 | 0 | 1;
export type DirY = -1 | 0 | 1;

export const DirXValues: { [key: string]: DirX } = {
  Left: -1,
  Idle: 0,
  Right: 1,
};

export const DirYValues: { [key: string]: DirY } = {
  Up: -1,
  Idle: 0,
  Down: 1,
};

export type Round = {
  left: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  right: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

export type Score = {
  leftRound: 0 | 1 | 2 | 3 | 4 | 5;
  rightRound: 0 | 1 | 2 | 3 | 4 | 5;
  round: Round[];
};

export type StatusMessage = {
  status: "Not Started" | "Stopped" | "Playing" | "Finished" | "Deleted";
  result: "Not Finished" | "Draw" | "Draw" | "Host" | "Opponent" | "Deleted";
  playerLeft: "Unknown" | "Connected" | "Playing" | "Paused" | "Disconnected";
  playerRight: "Unknown" | "Connected" | "Playing" | "Paused" | "Disconnected";
  timer: Timer | null;
};

export type Timer = {
  reason: "Start" | "ReStart" | "Round" | "Pause" | "Deconnection";
  start: Date;
  end: Date;
};

export type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type Color = {
  menu: RGBA;
  font: RGBA;
  roundWon: RGBA;
};

type Avatar = {
  image: string;
  variant: string;
  borderColor: string;
  backgroundColor: string;
  text: string;
  empty: boolean;
  decrypt: boolean;
};

export type Player = {
  id: number;
  name: string;
  color: RGBA;
  avatar: Avatar;
  side: "Left" | "Right";
};

export type PlayerDynamic = {
  posX: number;
  posY: number;
  speed: number;
  move: Action;
  push: number;
};

export type Ball = {
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
  backgroundImage: HTMLImageElement;
  ballImage: HTMLImageElement;
};

export type GameData = {
  // Fixed Data from Backend
  id: string;
  name: string;
  ball: Ball;
  playerLeft: Player | null;
  playerRight: Player | null;
  playerLeftDynamic: PlayerDynamic;
  playerRightDynamic: PlayerDynamic;
  playerLeftStatus:
    | "Unknown"
    | "Connected"
    | "Playing"
    | "Paused"
    | "Disconnected";
  playerRightStatus:
    | "Unknown"
    | "Connected"
    | "Playing"
    | "Paused"
    | "Disconnected";
  background: string;
  ballImg: string;
  type: "Classic" | "Best3" | "Best5" | "Custom";
  mode: "League" | "Party" | "Training";
  difficulty: 1 | 2 | 3 | 4 | 5;
  push: boolean;
  color: Color;
  maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  maxRound: 1 | 3 | 5 | 7 | 9;

  // Dynamic Data
  playerServe: "Left" | "Right" | null;
  actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  score: Score;
  timer: Timer | null;
  status: "Not Started" | "Stopped" | "Playing" | "Finished" | "Deleted";
  result: "Not Finished" | "Draw" | "Draw" | "Host" | "Opponent" | "Deleted";
};

export type InitData = {
  id: string;
  name: string;
  type: "Classic" | "Best3" | "Best5" | "Custom";
  mode: "League" | "Party" | "Training";
  maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  maxRound: 1 | 3 | 5 | 7 | 9;
  difficulty: 1 | 2 | 3 | 4 | 5;
  push: boolean;
  background: string;
  ball: string;
};
