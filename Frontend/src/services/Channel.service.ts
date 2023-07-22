// [!] voir si ce service est necessaire, pour le moment juste une fonction bebette

export default class Channel_Service {
  private token: string;

  // default value, in case of using bottom func
  constructor(token: string = "") {
    this.token = token;
  }

   // Fonction generique pour toutes les requettes http
   private async fetchData(isServerSide:boolean, url: string, method: string, body: any = null) {
	const preUrl:string = isServerSide ? `http://backend:4000/api/channel/` : `http://${process.env.HOST_IP}:4000/api/channel/`;

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
      throw new Error("fetched failed at " +  preUrl + url );

    return response;
  }


  public async getChannelAndUsers(id: number): Promise<ChannelUsersStatus> {
	const response: Response = await this.fetchData( true, id.toString(), "GET");
	const data:ChannelUsersStatus = await response.json();

	return data;
  }




/* -------- vvv NO NEED TOKEN HERE vvv ------- */

  public getIdsFromPrivateMsgChannelName(channelName: string): {
    id1: number;
    id2: number;
  } {
    const tuple: string[] = channelName.split(" ");

    if (tuple.length !== 2)
      return {
        id1: -1,
        id2: -1,
      };

    return {
      id1: parseInt(tuple[0]),
      id2: parseInt(tuple[1]),
    };
  }

  // name of Private Message channel format
  // 'id1 id2' with id1 < id2
  public formatPrivateMsgChannelName(id1: number, id2: number): string {
    const lower: number = id1 < id2 ? id1 : id2;
    const higher: number = id1 > id2 ? id1 : id2;

    return lower + " " + higher;
  }
}
