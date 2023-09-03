import fetchData from "@/lib/fetch/fetchData";

export default class AchievementService {
  private token?: string;

  constructor(token?: string) {
    if (token) this.token = token;
  }

  //Recupere la liste des game en cours
  public async getUserAchievement(userId: number): Promise<ReturnData> {
    try {
      const response = await fetchData(
        this.token,
        "achievement",
        `get/${userId}`,
        "GET"
      );
      const data: ReturnData = await response.json();
      return data;
    } catch (error) {
      console.log(`Error Getting User achievement: ${error}`);
      return {
        success: false,
        message: "Error Getting User achievement",
      };
    }
  }

  public async achievementAnnonced(
    userId: number,
    achievementId: string
  ): Promise<void> {
    try {
      await fetchData(
        this.token,
        "achievement",
        `annonced/${userId}/${achievementId}`,
        "PUT"
      );
    } catch (error) {
      console.log(`Error Getting User achievement: ${error}`);
    }
  }
}
