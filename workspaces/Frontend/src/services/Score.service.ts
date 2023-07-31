class ScoreService {
  private static instance: ScoreService;
  private token: string;

  constructor(token: any) {
    this.token = token;
    if (ScoreService.instance) {
      return ScoreService.instance;
    }
    ScoreService.instance = this;
  }

  // Fonction generique pour toutes les requettes http
  public async fetchData(url: string, methode: string, body: any = null) {
    const response = await fetch(
      `http://${process.env.HOST_IP}:4000/api/score/${url}`,
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
  public async getScoreByGameId(gameId: string): Promise<ReturnData> {
    const response = await this.fetchData(`game/${gameId}`, "GET");
    const data: ReturnData = await response.json();
    return data;
  }
}

export default ScoreService;
