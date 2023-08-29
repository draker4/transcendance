import fetchData from "@/lib/fetch/fetchData";
import { StatsUpdate } from "@transcendence/shared/types/Stats.types";

export default class StatsService {
  private token?: string;

  constructor(token?: string) {
    if (token) this.token = token;
  }

  //Recupere l'etat du joueur ( in game or not )
  public async getStatsByUserId(userId: number): Promise<ReturnData> {
    const response = await fetchData(
      this.token,
      "stats",
      `get/${userId}`,
      "GET"
    );
    const data = await response.json();
    return data;
  }

  public async updateStats(userId: number, update: StatsUpdate): Promise<void> {
    const body = JSON.stringify(update);
    await fetchData(this.token, "stats", `update/${userId}`, "PUT", body);
  }
}
