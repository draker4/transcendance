import fetchData from "@/lib/fetch/fetchData";

export default class MatchmakingService {
  private searching: boolean = false;
  private token?: string;

  constructor(token?: string) {
    if (token) this.token = token;
  }

  //Mets le joueur dans la file d'attente
  public async startSearch(type: "Classic" | "Best3" | "Best5"): Promise<any> {
    const body = JSON.stringify({ type });
    const response = await fetchData(
      this.token,
      "matchmaking",
      "start",
      "PUT",
      body
    );
    const data = await response.json();
    return data;
  }

  //Sors le joueur de la file d'attente
  public async stopSearch(): Promise<any> {
    const response = await fetchData(this.token, "matchmaking", "stop", "PuT");
    const data = await response.json();
    return data;
  }

  //Demande si le joueur à trouvé une game
  public async checkSearch(): Promise<any> {
    const response = await fetchData(this.token, "matchmaking", "check", "GET");
    const data = await response.json();
    return data;
  }
}
