import { CryptoService } from "./crypto/Crypto.service";
import fetchClientSide from "@/lib/fetch/fetchClientSide";

const Crypto = new CryptoService();

export default class Profile_Service {
  private token?: string;

  constructor(token?: string) {
    if (token)
      this.token = token;
  }

  private async fetchData(
    url: string,
    method: string,
    body: any = null
  ) {
    const preUrl = this.token
      ? `http://backend:4000/api/users/`
      : `http://${process.env.HOST_IP}:4000/api/users/`;

    if (this.token) {
      const response = await fetch(preUrl + url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        },
        body: body,
      });

      if (!response.ok) throw new Error("fetched failed at " + preUrl + url);
      return response;
    } else {
      const response = await fetchClientSide(preUrl + url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      if (!response.ok) throw new Error("fetched failed at " + preUrl + url);

      return response;
    }
  }

  public async getProfileByToken(): Promise<Profile> {

	const profile = await this.fetchData("me", "GET");

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

  public async getProfileById(id: number): Promise<Profile> {
    
	const profile = await this.fetchData(`profile/${id.toString()}`,"GET");
	
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

	  let rep:Rep = {
		  success: false,
		  message: ""
		};
	try {

		const body = JSON.stringify({properties : properties});
		const response = await this.fetchData("", "PUT", body);
		
		if (response.ok) {
			rep.message = await response.json();
			rep.success = true
		} else {
		    rep.message = "error response from server, try it later please";
		}
	} catch(error) {
		rep.message = "error occured while editUser process"
	}

    return rep;
  }

  // GetProfilByToken() version fetching Avatar too
  public async getProfileAndAvatar(): Promise<Profile & { avatar: Avatar }> {
    const profile = await this.fetchData("myAvatar", "GET", null);

    const data: Profile & { avatar: Avatar } = await profile.json();

    data.first_name = (await Crypto.decrypt(data.first_name)).toString();
    data.last_name = (await Crypto.decrypt(data.last_name)).toString();
    data.email = (await Crypto.decrypt(data.email)).toString();
    data.phone = (await Crypto.decrypt(data.phone)).toString();
    data.image = (await Crypto.decrypt(data.image)).toString();

    return data;
  }

}
