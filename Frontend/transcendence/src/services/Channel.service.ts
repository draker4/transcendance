// [!] voir si ce service est necessaire, pour le moment juste une fonction bebette

export default class Channel_Service {
  private static instance: Channel_Service;

  // intance singleton
  constructor() {
    if (Channel_Service.instance) {
      return Channel_Service.instance;
    }
    Channel_Service.instance = this;
  }

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
