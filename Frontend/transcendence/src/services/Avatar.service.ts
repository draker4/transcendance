import avatarType from "@/types/Avatar.type";

export default class Avatar_Service {
  private static instance: Avatar_Service;
  private token: string;

  // Instance singleton
  constructor(token: string) {
    this.token = token;
    if (Avatar_Service.instance) return Avatar_Service.instance;
    Avatar_Service.instance = this;
  }

  // Fonction generique pour toutes les requettes http
  public async fetchData(url: string, method: string, body: any = null) {
    // console.log("into FetchData");

    const response = await fetch(`http://backend:4000/api/avatar/${url}/false`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      },
      body: body,
    });

    // console.log("response :", response);

    if (!response.ok)
      // [?] throw exception? -> attention de comment je gere ca
      throw new Error(
        "fetched failed at http://backend:4000/api/avatar/" + url + "/false"
      );

    return response;
  }

  // [?][!] c'est merdique non ? ^_^
  // [!] url different si on est cote client
  public async fetchDataClientSide(
    url: string,
    method: string,
    body: any = null
  ) {
    // console.log("into FetchData");

    const response = await fetch(`http://${process.env.HOST_IP}:4000/api/avatar/${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      },
      body: body,
    });

    console.log("response :", response);

    if (!response.ok)
      // [?] throw exception? -> attention de comment je gere ca
      throw new Error(
        `fetched failed at http://${process.env.HOST_IP}:4000/api/avatar/${url}`
      );

    return response;
  }

  public test(): void {
    console.log("Avatar service is working");
  }

  public async getAvatarByName(login: string): Promise<avatarType> {
    const response: Response = await this.fetchData(login, "GET");
    const data: Promise<avatarType> = await response.json();

    return data;
  }

  // [?] type de retour ?   : Promise<any> (@_@')
  // [?] dans le backend verifier que les couleurs sont des hexa valides
  //     si c'est pas le cas, pas de changement de couleur + response
  //     en fonction success -> false ?
  public async submitAvatarColors(
    borderColor: string,
    backgroundColor: string,
    isChannel: boolean,
  ) {
    const body = JSON.stringify({ borderColor, backgroundColor, isChannel });

    // console.log("body = ", body);

    const response = await this.fetchDataClientSide("", "PUT", body);

    // const data = await response.json();
  }
}
