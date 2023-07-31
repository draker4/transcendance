class LobbyService {
  private static instance: LobbyService;
  private token: string;

  constructor(token: any) {
    this.token = token;
    if (LobbyService.instance) {
      return LobbyService.instance;
    }
    LobbyService.instance = this;
  }

  // Fonction generique pour toutes les requettes http
  public async fetchData(url: string, methode: string, body: any = null) {
    const response = await fetch(
      `http://${process.env.HOST_IP}:4000/api/lobby/${url}`,
      {
        method: methode,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        },
        body: body,
      }
    );

    if (!response.ok) throw new Error("connexion refused");

    return response;
  }

  //Recupere l'etat du joueur ( in game or not )
  public async isInGame(): Promise<any> {
    const response = await this.fetchData("isingame", "GET");
    const data = await response.json();
    return data;
  }

  //Creer la game
  public async createGame(gameData: GameDTO): Promise<any> {
    const body = JSON.stringify(gameData);
    const response = await this.fetchData("create", "POST", body);
    const data = await response.json();
    return data;
  }

  public async joinGame(gameId: string): Promise<any> {
    const response = await this.fetchData(`join/${gameId}`, "PUT");
    const data = await response.json();
    return data;
  }


  //Quit la partie en cours
  public async quitGame(): Promise<any> {
    await this.fetchData("quit", "POST");
  }

  //Recupere la liste des game en cours
  public async getGameList(): Promise<ReturnData> {
    const response = await this.fetchData("getall", "GET");
    const data: ReturnData = await response.json();
    return data;
  }

  //Get league data
  public async getLeague(): Promise<any> {
    const response = await this.fetchData("getleague", "GET");
    const data = await response.json();
    return data;
  }
}

export default LobbyService;
