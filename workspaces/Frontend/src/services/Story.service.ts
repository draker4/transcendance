import fetchData from "@/lib/fetch/fetchData";

export default class StoryService {
  private token?: string;

  constructor(token?: string) {
    if (token) this.token = token;
  }

  //Recupere la liste des game en cours
  public async getUserStories(userId: number): Promise<ReturnData | undefined> {
    try {
      const response = await fetchData(
        this.token,
        "story",
        `get/${userId}`,
        "GET"
      );
      const data: ReturnData = await response.json();
      return data;
    } catch (error) {
      console.log(`Error Getting User Stories: ${error}`);
    }
  }
}
