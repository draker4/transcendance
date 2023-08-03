import { ScoreInfo } from "@transcendence/shared/types/Score.types";
import fetchData from "@/lib/fetch/fetchData";

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
}
