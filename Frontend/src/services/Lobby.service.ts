import { useRouter } from "next/navigation";

class LobbyService {
  private static instance: LobbyService;
  private token: string;
  private router = useRouter();

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
  public async IsInGame(): Promise<any> {
    const response = await this.fetchData("isingame", "GET");
    const data = await response.json();
    if (data.success === true) {
      return data.data.uuid;
    }
    if (data.success === false) {
      return "";
    }
  }

  //Creer la game
  public async CreateGame(gameData: GameDTO): Promise<any> {
    const body = JSON.stringify(gameData);
    const response = await this.fetchData("create", "POST", body);
    const data = await response.json();
    if (data.success === false) {
      return false;
    }
    const url = "home/game/" + data.data.id;
    this.router.push(url);
  }

  //Reprendre la partie en cours
  public async ResumeGame(gameID: string): Promise<any> {
    const url = "home/game/" + gameID;
    this.router.push(url);
  }

  //Quit la partie en cours
  public async quitGame(): Promise<any> {
    await this.fetchData("quit", "POST");
  }

  //Recupere la liste des game en cours
  public async GetGameList(): Promise<any> {
    const response = await this.fetchData("getall", "GET");
    const data = await response.json();
    return data.data;
  }

  //Charge une page
  public async LoadPage(url: string): Promise<any> {
    this.router.push(url);
  }

  //Recupere les infos de la game
  public async accessGame(gameID: String | undefined): Promise<any> {
    if (gameID === undefined) return false;
    const response = await this.fetchData(`access/${gameID}`, "GET");
    const data = await response.json();
    return data;
  }

  //Get league data
  public async GetLeague(): Promise<any> {
    const response = await this.fetchData("getleague", "GET");
    const data = await response.json();
    return data;
  }
}

export default LobbyService;
