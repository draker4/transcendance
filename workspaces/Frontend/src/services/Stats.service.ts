import fetchData from "@/lib/fetch/fetchData";

export default class StatsService {
  private token?: string;

  constructor(token?: string) {
    if (token) this.token = token;
  }

  //Recupere l'etat du joueur ( in game or not )
  public async getStatsByUserId(userId: string): Promise<Stats> {
    const response = await fetchData(
      this.token,
      "stats",
      `get/${userId}`,
      "GET"
    );
    const data = await response.json();
    return data;
  }
}
