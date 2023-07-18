import { CryptoService } from "./crypto/Crypto.service";

const Crypto = new CryptoService();

export default class Profile_Service {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  public async getProfileByToken(): Promise<Profile> {
    const profile = await fetch("http://backend:4000/api/users/me", {
      method: "GET",
      headers: { Authorization: "Bearer " + this.token },
    });

    if (!profile.ok) {
      throw new Error("Profil cannot be found");
    }

    const data: Profile = await profile.json();

    data.first_name = (await Crypto.decrypt(data.first_name)).toString();
    data.last_name = (await Crypto.decrypt(data.last_name)).toString();
    data.email = (await Crypto.decrypt(data.email)).toString();
    data.phone = (await Crypto.decrypt(data.phone)).toString();
    data.image = (await Crypto.decrypt(data.image)).toString();

    return data;
  }

  public async getProfileByLogin(login: string): Promise<Profile> {
    const profile = await fetch(
      `http://backend:4000/api/users/profile/${login}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + this.token },
      }
    );

    if (!profile.ok) {
      throw new Error("Profil cannot be found");
    }

    const data: Profile = await profile.json();

    data.first_name = (await Crypto.decrypt(data.first_name)).toString();
    data.last_name = (await Crypto.decrypt(data.last_name)).toString();
    data.email = (await Crypto.decrypt(data.email)).toString();
    data.phone = (await Crypto.decrypt(data.phone)).toString();
    data.image = (await Crypto.decrypt(data.image)).toString();

    return data;
  }

  public async editUser(properties: Record<string, string>) {

    const body = JSON.stringify({properties : properties});
    const response = await this.fetchDataClientSide("", "PUT", body);

	let rep:Rep = {
		success: false,
		message: ""
	};

    if (response.ok) {
      rep = await response.json();
    } else {
      rep.message = "error response from server, try it later please";
    }

    return rep;
  }

  // GetProfilByToken() version fetching Avatar too
  public async getProfileAndAvatar(): Promise<Profile & { avatar: Avatar }> {
    const profile = await this.fetchDataServerSide("myAvatar", "GET", null);

    const data: Profile & { avatar: Avatar } = await profile.json();

    data.first_name = (await Crypto.decrypt(data.first_name)).toString();
    data.last_name = (await Crypto.decrypt(data.last_name)).toString();
    data.email = (await Crypto.decrypt(data.email)).toString();
    data.phone = (await Crypto.decrypt(data.phone)).toString();
    data.image = (await Crypto.decrypt(data.image)).toString();

    return data;
  }

  /* --------------------------------- private tools ------------------------- */

  // [!] url different si on est cote client
  private async fetchDataClientSide(
    url: string,
    method: string,
    body: any = null
  ) {
    const response = await fetch(
      `http://${process.env.HOST_IP}:4000/api/users/${url}`,
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
        `fetched failed at http://${process.env.HOST_IP}:4000/api/avatar/${url}`
      );

    return response;
  }

  private async fetchDataServerSide(
    url: string,
    method: string,
    body: any = null
  ) {
    const response = await fetch(`http://backend:4000/api/users/${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      },
      body: body,
    });

    if (!response.ok)
      throw new Error(
        `fetched failed at http://${process.env.HOST_IP}:4000/api/avatar/${url}`
      );

    return response;
  }
}
