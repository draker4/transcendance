import styles from "@/styles/profile/InfoCard.module.css";
import Item from "./Item";
import MottoDisplayOnly from "./custom/tagline/MottoDisplayOnly";
import StoryDisplayOnly from "./custom/story/StoryDisplayOnly";
import { useEffect, useState } from "react";
import StatsService from "@/services/Stats.service";
import StoryService from "@/services/Story.service";
import StoryLevel from "./ItemContent/StoryLevel";
import Winrate from "./ItemContent/Winrate";
import Rank from "./ItemContent/Rank";
import XPBar from "./ItemContent/XPBar";
import { ShortStats } from "@transcendence/shared/types/Stats.types";
import disconnect from "@/lib/disconnect/disconnect";
import { useRouter } from "next/navigation";
import LastAchievement from "./lastAchievement/LastAchievement";

type Props = {
  profile: Profile;
};

export default function SectionPongStats({ profile }: Props) {
  const [storyLevel, setStoryLevel] = useState<number>(0);
  const [shortStats, setShortStats] = useState<ShortStats>({
    leagueRank: 0,
    leaguePoints: 0,
    leveling: {
      level: 1,
      userXp: 0,
      nextLevelXP: 100,
      cumulativeXpToNext: 0,
      progress: 0,
    },
    gameWon: 0,
    gameLost: 0,
    leagueWon: 0,
    leagueLost: 0,
    partyWon: 0,
    partyLost: 0,
    trainingWon: 0,
    trainingLost: 0,
    demoWatched: 0,
    storyLevelCompleted: 0,
  });
  const storyService = new StoryService(undefined);
  const statService = new StatsService(undefined);
  const router = useRouter();

  const loadStats = async () => {
    try {
      const rep = await statService.getShortStats(profile.id);

      if (rep.success && rep.data) {
        setShortStats(rep.data);
      } else {
        throw new Error(rep.message);
      }
    } catch (error: any) {
      if (error.message === "disconnect") {
        await disconnect();
        router.refresh();
        return;
      }
      console.log(`loadStats error : ${error.message}`);
    }
  };

  const loadStory = async () => {
    try {
      const rep = await storyService.getUserStories(profile.id);

      if (rep !== undefined && rep.success) {
        let checkLevel: number = 0;
        while (rep.data[checkLevel].levelCompleted) {
          checkLevel++;
        }
        setStoryLevel(checkLevel);
      } else {
        throw new Error(
          rep !== undefined
            ? rep.message
            : "loadStory error : response undefined"
        );
      }
    } catch (error: any) {
      if (error.message === "disconnect") {
        await disconnect();
        router.refresh();
        return;
      }
      console.log(`loadStory error : ${error.message}`);
    }
  };

  useEffect(() => {
    loadStats();
    loadStory();
  }, []);

  return (
    <div className={`${styles.sections} ${styles.columnStart}`}>
      <MottoDisplayOnly profile={profile} />

      <StoryDisplayOnly profile={profile} />

      <p className={styles.tinyTitle}>Level</p>
      <XPBar
        userLevel={
          shortStats.leveling
            ? shortStats.leveling
            : {
                level: 1,
                userXp: 0,
                nextLevelXP: 100,
                cumulativeXpToNext: 0,
                progress: 0,
              }
        }
      />

      <p className={styles.tinyTitle}>League</p>
      <div className={styles.leagueContainer}>
        <Rank
          rank={shortStats.leagueRank}
          leaguePoints={shortStats.leaguePoints}
        />
        <div className={styles.subLeagueContainer}>
          <Item title="League Winrate">
            <Winrate
              winData={{
                gameWon: shortStats.leagueWon,
                gameLost: shortStats.leagueLost,
                showPlaceholder: true,
              }}
            />
          </Item>
        </div>
      </div>

      <p className={styles.tinyTitle}>Play for fun</p>
      <Item title="Story Level">
        <StoryLevel storyLevel={storyLevel} />
      </Item>

      <Item title="Global Winrate">
        <Winrate
          winData={{
            gameWon: shortStats.gameWon,
            gameLost: shortStats.gameLost,
            showPlaceholder: true,
          }}
        />
      </Item>

      <Item title="Recent Achievements">
        <LastAchievement
          profile={profile}
          setStats={setShortStats}
          statsService={statService}
        />
      </Item>
    </div>
  );
}
