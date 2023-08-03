import fetchData from "@/lib/fetch/fetchData";
import { CryptoService } from "./Crypto.service";

const Crypto = new CryptoService();

export default class Avatar_Service {
  private token?: string;

  constructor(token?: string) {
    if (token) this.token = token;
  }

  private makeUrl(id: number, isChannel: boolean): string {
    const boolAsString: string = isChannel ? "true" : "false";
    return id.toString() + "/" + boolAsString;
  }

  /* ----------------------------- PUBLIC METHODS ---------------------------- */

  public async getAvatarbyUserId(id: number): Promise<Avatar> {
    const response: Response = await fetchData(
      this.token,
      "avatar",
      this.makeUrl(id, false),
      "GET"
    );
    const data: Avatar = await response.json();

    if (data?.decrypt && data?.image.length > 0) {
      data.image = await Crypto.decrypt(data.image);
      data.decrypt = false;
    }

    return data;
  }

  public async getChannelAvatarById(id: number): Promise<Avatar> {
    const response: Response = await fetchData(
      this.token,
      "avatar",
      this.makeUrl(id, false),
      "GET"
    );
    const avatar: Avatar = await response.json();

    if (avatar?.decrypt && avatar?.image.length > 0) {
      avatar.image = await Crypto.decrypt(avatar.image);
      avatar.decrypt = false;
    }

    return avatar;
  }

  // isChannel value is the channelId, 0 mean it's not a channel but an user's.
  public async submitAvatarColors(
    borderColor: string,
    backgroundColor: string,
    isChannel: number
  ) {
    const body = JSON.stringify({ borderColor, backgroundColor, isChannel });
    const response = await fetchData(this.token, "avatar", "", "PUT", body);
    const data = await response.json();
  }
}
