import {
  ScoreInfo,
  ScoreUpdate,
} from "@transcendence/shared/types/Score.types";
import fetchData from "@/lib/fetch/fetchData";
import { PauseUpdate } from "@transcendence/shared/types/Pause.types";

export default class ScoreService {
  private token?: string;

  constructor(token?: string) {
    if (token) this.token = token;
  }

  //Recupere l'etat du joueur ( in game or not )
  public async getScoreByGameId(gameId: string): Promise<ScoreInfo> {
    const response = await fetchData(
      this.token,
      "score",
      `game/${gameId}`,
      "GET"
    );
    const data = await response.json();
    return data;
  }

  public async updateScore(gameId: string, update: ScoreUpdate): Promise<void> {
    const body = JSON.stringify(update);
    const response = await fetchData(
      this.token,
      "score",
      `update/${gameId}`,
      "PUT",
      body
    );
  }

  public async updatePause(gameId: string, update: PauseUpdate): Promise<void> {
    const body = JSON.stringify(update);
    await fetchData(this.token, "score", `updatePause/${gameId}`, "PUT", body);
  }
}
