import { ScoreInfo } from "./Score.types";
import { Timer, PlayerDynamic, Ball } from "./Game.types";


export type StatusMessage = {
  status: "Not Started" | "Stopped" | "Playing" | "Finished" | "Deleted";
  result: "Not Finished" | "Draw" | "Draw" | "Host" | "Opponent" | "Deleted";
  playerLeft: "Unknown" | "Connected" | "Playing" | "Paused" | "Disconnected";
  playerRight: "Unknown" | "Connected" | "Playing" | "Paused" | "Disconnected";
  timer: Timer | null;
};

export type UpdateData = {
  playerLeftDynamic: PlayerDynamic;
  playerRightDynamic: PlayerDynamic;
  ball: Ball;
  score: ScoreInfo;
  actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};
