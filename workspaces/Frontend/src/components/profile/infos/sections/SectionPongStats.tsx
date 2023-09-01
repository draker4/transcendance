import styles from "@/styles/profile/InfoCard.module.css";
import Item from "./Item";
import MottoDisplayOnly from "./tagline/MottoDisplayOnly";
import StoryDisplayOnly from "./story/StoryDisplayOnly";
import { useEffect, useState } from "react";
import StatsService from "@/services/Stats.service";
import StoryService from "@/services/Story.service";
import StoryLevel from "./ItemContent/StoryLevel";

type Props = {
  profile: Profile;
};

export default function SectionPongStats({ profile }: Props) {

    const [storyLevel, setStoryLevel] = useState<number>(0);
    const storyService = new StoryService(undefined);
    const statService = new StatsService(undefined);

    const loadStats = async () => {
        const rep = await statService.getStatsByUserId(profile.id);

        if (rep.success) {
            console.log("STATS FETCHING => data : ", rep.data); // checking
        }
    }

    const loadStory = async () => {
        const rep = await storyService.getUserStories(profile.id);

        if (rep !== undefined && rep.success) {
            console.log("STORY FETCHING => data : ", rep.data);  // checking
            let checkLevel: number = 0;
            while (rep.data[checkLevel].levelCompleted) {
                checkLevel++;
            }
            setStoryLevel(checkLevel);
        }
    }

    useEffect(() => {
        loadStats();
        loadStory();
      }, [])

  return (
    <div className={styles.sections}>

      <MottoDisplayOnly profile={profile} />

      <StoryDisplayOnly profile={profile} />

      <Item title="Story Level">
        <StoryLevel storyLevel={storyLevel} />
      </Item>

      <Item title="Recent Achievement">
        <p>items content : customize it with a specific component</p>
      </Item>

      <Item title="Ranking">
        <p>items content : customize it with a specific component</p>
      </Item>

      <Item title="Recent games">
        <p>items content : customize it with a specific component</p>
      </Item>

    </div>
  );
}
