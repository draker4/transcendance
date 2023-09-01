import fetchData from "@/lib/fetch/fetchData";
export default class LobbyService {
  private token?: string;

  constructor(token?: string) {
    if (token) this.token = token;
  }

  //Creer la game
  public async createGame(gameData: GameDTO): Promise<ReturnData> {
    const body = JSON.stringify(gameData);
    const response = await fetchData(
      this.token,
      "lobby",
      "create",
      "POST",
      body
    );
    const data = await response.json();
    return data;
  }

  //Recupere l'etat du joueur ( in game or not )
  public async userInGame(): Promise<ReturnData> {
    const response = await fetchData(this.token, "lobby", `userInGame`, "GET");
    const data = await response.json();
    return data;
  }

  //Recupere l'etat du joueur ( in game or not )
  public async otherInGame(userId: number): Promise<ReturnData> {
    const response = await fetchData(
      this.token,
      "lobby",
      `otherInGame/${userId}`,
      "GET"
    );
    const data = await response.json();
    return data;
  }

  public async ongoingInvite(inviterId: number): Promise<ReturnData> {
    const response = await fetchData(
      this.token,
      "lobby",
      `ongoingInvite/${inviterId}`,
      "GET"
    );
    const data = await response.json();
    return data;
  }

  //Recupere la liste des game en cours
  public async getCurrentGame(mode?: "League" | "Party"): Promise<ReturnData> {
    const response = await fetchData(
      this.token,
      "lobby",
      mode ? `getCurrentGame/${mode}` : "getCurrentGame",
      "GET"
    );
    const data: ReturnData = await response.json();
    return data;
  }

  //Get leaderboard data
  public async getLeaderboard(): Promise<any> {
    const response = await fetchData(
      this.token,
      "lobby",
      "getLeaderboard",
      "GET"
    );
    const data = await response.json();
    return data;
  }

  public async joinGame(gameId: string): Promise<ReturnData> {
    const response = await fetchData(
      this.token,
      "lobby",
      `join/${gameId}`,
      "PUT"
    );
    const data = await response.json();
    return data;
  }

  //Quit la partie en cours
  public async quitGame(): Promise<void> {
    await fetchData(this.token, "lobby", "quit", "POST");
  }
}
