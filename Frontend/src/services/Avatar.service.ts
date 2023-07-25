import { CryptoService } from "./crypto/Crypto.service";

const Crypto = new CryptoService();

export default class Avatar_Service {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  // Fonction generique pour toutes les requettes http
  private async fetchData(isServerSide:boolean, url: string, method: string, body: any = null) {
	const preUrl:string = isServerSide ? `http://backend:4000/api/avatar/` : `http://${process.env.HOST_IP}:4000/api/avatar/`;

    const response = await fetch(
      preUrl + url,
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        },
        body: body,
      }
    );

    if (!response.ok)
      throw new Error(
        "fetched failed at " +  preUrl + url
      );
	  // [+] VERIFIER TOUS LES TRY CATCH comme ici

    return response;
  }

  private makeUrl(id:number, isChannel:boolean):string {
	const boolAsString:string = isChannel ? "true" : "false";
	return id.toString() + "/" + boolAsString;
  }

  public async getAvatarbyUserId(id: number): Promise<Avatar> {
    const response: Response = await this.fetchData( true, this.makeUrl(id, false), "GET");
    const data: Avatar = await response.json();

    if (data?.decrypt && data?.image.length > 0) {
      data.image = await Crypto.decrypt(data.image);
      data.decrypt = false;
    }

    return data;
  }

  public async getChannelAvatarById(id: number): Promise<Avatar> {
	const response: Response = await this.fetchData(true, this.makeUrl(id, true), "GET");
	const avatar: Avatar = await response.json();

    if (avatar?.decrypt && avatar?.image.length > 0) {
		avatar.image = await Crypto.decrypt(avatar.image);
		avatar.decrypt = false;
    }

	return avatar;
}

  // [?] type de retour ?   : Promise<any> (@_@')
  // [+] gestion de la reponse ?
  // isChannel value is the channelId, 0 mean it's not a channel but an user's.
  public async submitAvatarColors(
    borderColor: string,
    backgroundColor: string,
    isChannel: number,
  ) {
    const body = JSON.stringify({ borderColor, backgroundColor, isChannel });

    // console.log("body = ", body);

    const response = await this.fetchData(false, "", "PUT", body);

    // const data = await response.json();
  }
}
