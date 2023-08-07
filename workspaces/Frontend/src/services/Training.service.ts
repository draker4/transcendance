import fetchData from "@/lib/fetch/fetchData";

export default class TrainingService {
  private token?: string;

  constructor(token?: string) {
    if (token) this.token = token;
  }

  //Creer la game
  public async createTraining(
    training: CreateTrainingDTO
  ): Promise<ReturnData> {
    const body = JSON.stringify(training);
    const response = await fetchData(
      this.token,
      "training",
      "create",
      "POST",
      body
    );
    const data = await response.json();
    return data;
  }

  //Recupere la liste des game en cours
  public async getTrainingData(id: string): Promise<ReturnData> {
    const response = await fetchData(
      this.token,
      "training",
      `get/${id}`,
      "GET"
    );
    const data: ReturnData = await response.json();
    return data;
  }

  //Recupere l'etat du joueur ( in game or not )
  public async isInTraining(): Promise<ReturnData> {
    const response = await fetchData(
      this.token,
      "training",
      "isInTraining",
      "GET"
    );
    const data = await response.json();
    return data;
  }

  //Recupere la liste des game en cours
  public async updateTraining(
    id: string,
    update: UpdateTrainingDTO
  ): Promise<ReturnData> {
    const body = JSON.stringify(update);
    const response = await fetchData(
      this.token,
      "training",
      `update/${id}`,
      "PUT",
      body
    );
    const data: ReturnData = await response.json();
    return data;
  }

  //Quit la partie en cours
  public async quitTraining(id: string): Promise<ReturnData> {
    const response = await fetchData(
      this.token,
      "training",
      `quit/${id}`,
      "POST"
    );
    const data: ReturnData = await response.json();
    return data;
  }
}
