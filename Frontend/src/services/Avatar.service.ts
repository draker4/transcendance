import { CryptoService } from "./crypto/Crypto.service";

const Crypto = new CryptoService();

export default class Avatar_Service {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  // Fonction generique pour toutes les requettes http
  private async fetchData(url: string, method: string, body: any = null) {
    // console.log("into FetchData"); // checking

    const response = await fetch(
      `http://backend:4000/api/avatar/${url}/false`,
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        },
        body: body,
      }
    );

    // console.log("response :", response); // checking

    if (!response.ok)
      // [?] throw exception? -> attention de comment je gere ca
      throw new Error(
        "fetched failed at http://backend:4000/api/avatar/" + url + "/false"
      );

    return response;
  }

  // [?][!] c'est merdique non ? ^_^
  // [!] url different si on est cote client
  private async fetchDataClientSide(
    url: string,
    method: string,
    body: any = null
  ) {
    const response = await fetch(
      `http://${process.env.HOST_IP}:4000/api/avatar/${url}`,
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        },
        body: body,
      }
    );

    // console.log("response :", response); // checking

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

  //   public async getAvatarByName(login: string): Promise<Avatar> {
  //     const response: Response = await this.fetchData(login, "GET");
  //     const data: Avatar = await response.json();

  //     if (data?.decrypt && data?.image.length > 0) {
  //       data.image = await Crypto.decrypt(data.image);
  //       data.decrypt = false;
  //     }

  //     return data;
  //   }

  public async getAvatarbyUserId(id: number): Promise<Avatar> {
    const response: Response = await this.fetchData( id.toString(), "GET");
    const data: Avatar = await response.json();

    if (data?.decrypt && data?.image.length > 0) {
      data.image = await Crypto.decrypt(data.image);
      data.decrypt = false;
    }

    return data;
  }

  // [?] type de retour ?   : Promise<any> (@_@')
  // [?] dans le backend verifier que les couleurs sont des hexa valides
  //     si c'est pas le cas, pas de changement de couleur + response
  //     en fonction success -> false ?
  public async submitAvatarColors(
    borderColor: string,
    backgroundColor: string
    // isChannel: boolean [!][?] nécessaire ?
  ) {
    const body = JSON.stringify({ borderColor, backgroundColor });

    // console.log("body = ", body);

    const response = await this.fetchDataClientSide("", "PUT", body);

    // const data = await response.json();
  }
}
