import fetchData from "@/lib/fetch/fetchData";
import {
  StatsImproved,
  StatsUpdate,
} from "@transcendence/shared/types/Stats.types";

export default class StatsService {
  private token?: string;

  constructor(token?: string) {
    if (token) this.token = token;
  }

  public async getShortStats(
    userId: number
  ): Promise<ReturnDataTyped<StatsImproved>> {
    const rep: ReturnDataTyped<StatsImproved> = {
      success: false,
      message: "",
    };

    try {
      const response = await fetchData(
        this.token,
        "stats",
        `getShort/${userId}`,
        "GET"
      );

      if (!response.ok)
        throw new Error(`fetching Short stats of user[${userId}] impossible`);

      const repStats = await response.json();

      if (!repStats.success) throw new Error(repStats.messsage);

      rep.data = repStats.data;
      rep.success = true;
    } catch (error: any) {
      rep.message = error.message
        ? error.message
        : `An unkkown error occured while getting full stats of user[${userId}]`;
      rep.error = error;
    }

    return rep;
  }

  public async getFullStats(
    userId: number
  ): Promise<ReturnDataTyped<StatsImproved>> {
    const rep: ReturnDataTyped<StatsImproved> = {
      success: false,
      message: "",
    };

    try {
      const response = await fetchData(
        this.token,
        "stats",
        `getFull/${userId}`,
        "GET"
      );

      if (!response.ok)
        throw new Error(`fetching Full stats of user[${userId}] impossible`);

      const repStats = await response.json();

      if (!repStats.success) throw new Error(repStats.messsage);

      rep.data = repStats.data;
      rep.success = true;
    } catch (error: any) {
      rep.message = error.message
        ? error.message
        : `An unkkown error occured while getting short stats of user[${userId}]`;
      rep.error = error;
    }

    return rep;
  }

  public async getUserLevel(
    userId: number
  ): Promise<ReturnDataTyped<StatsImproved>> {
    const rep: ReturnDataTyped<StatsImproved> = {
      success: false,
      message: "",
    };

    try {
      const response = await fetchData(
        this.token,
        "stats",
        `getUserLevel/${userId}`,
        "GET"
      );

      if (!response.ok)
        throw new Error(`fetching User Level of user[${userId}] impossible`);

      const repStats = await response.json();

      if (!repStats.success) throw new Error(repStats.messsage);

      rep.data = repStats.data;
      rep.success = true;
    } catch (error: any) {
      rep.message = error.message
        ? error.message
        : `An unkkown error occured while getting User Level of user[${userId}]`;
      rep.error = error;
    }

    return rep;
  }

  public async updateStats(userId: number, update: StatsUpdate): Promise<void> {
    const body = JSON.stringify(update);
    await fetchData(this.token, "stats", `update/${userId}`, "PUT", body);
  }
}
