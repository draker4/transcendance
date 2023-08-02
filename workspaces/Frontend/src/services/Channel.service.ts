// [!] voir si ce service est necessaire, pour le moment juste une fonction bebette

import fetchClientSide from "@/lib/fetch/fetchClientSide";

export default class Channel_Service {
  private token: string;

  // default value, in case of using bottom func
  constructor(token: string = "") {
    this.token = token;
  }

  // Fonction generique pour toutes les requettes http
  private async fetchData(
    isServerSide: boolean,
    url: string,
    method: string,
    body: any = null
  ) {
    const preUrl: string = isServerSide
      ? `http://backend:4000/api/channel/`
      : `http://${process.env.HOST_IP}:4000/api/channel/`;

    if (isServerSide) {
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

  public async getChannelAndUsers(id: number): Promise<ChannelUsersRelation> {
    const response: Response = await this.fetchData(true, id.toString(), "GET");
    const data: ChannelUsersRelation = await response.json();

    console.log("GET CHANNEL & USERS \n :", data);
    return data;
  }


  public async editRelation(channelId: number, userId: number, newRelation: {isChanOp?: boolean,
	isBanned?: boolean,
	joined?: boolean,
	invited?: boolean,
}) {

	let rep:ReturnData = {
		success: false,
		message: "",
	}

	try {
		
		if (Object.keys(newRelation).length === 0) {
			throw new Error("no relation property in request");
		}
	
		const body = JSON.stringify({
			channelId: channelId,
			userId: userId,
			newRelation: {
				...(newRelation.isChanOp !== undefined && { isChanOp: newRelation.isChanOp }),
				...(newRelation.isBanned !== undefined && { isBanned: newRelation.isBanned }),
				...(newRelation.joined !== undefined && { joined: newRelation.joined }),
				...(newRelation.invited !== undefined && { invited: newRelation.invited }),
			  }
		});

		console.log("BODY :", body); // checking
		const response: Response = await this.fetchData(false, "editRelation", "PUT",  body);

	} catch(e:any) {
		rep.message = e.message;
	}

	return rep;
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
