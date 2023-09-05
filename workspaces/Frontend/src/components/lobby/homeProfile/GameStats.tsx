import styles from "@/styles/lobby/homeProfile/HomeProfile.module.css";
import StatsService from "@/services/Stats.service";
import { useState, useEffect } from "react";
import { ShortStats } from "@transcendence/shared/types/Stats.types";
import Rank from "@/components/profile/infos/sections/ItemContent/Rank";
import disconnect from "@/lib/disconnect/disconnect";
import { useRouter } from "next/navigation";
import XPBar from "@/components/profile/infos/sections/ItemContent/XPBar";
import Achievement from "@/components/lobby/homeProfile/Achievement";
import Item from "@/components/profile/infos/sections/Item";
import StoryLevel from "@/components/profile/infos/sections/ItemContent/StoryLevel";
import StoryService from "@/services/Story.service";

type Props = {
  profile: Profile;
};

export default function GameStats({ profile }: Props) {
  const statsService = new StatsService();
  const storyService = new StoryService();
  const [stats, setStats] = useState<ShortStats | undefined>(undefined);
  const [storyLevel, setStoryLevel] = useState<number>(0);
  const router = useRouter();

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
        throw new Error(rep !== undefined ? rep.message : "loadStory error : response undefined");
      }
    } catch(error:any) {
      if (error.message === 'disconnect') {
        await disconnect();
        router.refresh();
        return ;
      }
      console.log(`loadStory error : ${error.message}`)
    }
}

  useEffect(() => {
    const getStats = async () => {
      try {
        const ret = await statsService.getShortStats(profile.id);
        if (ret.success) {
          setStats(ret.data);
          console.log("Stats:", ret.data);
        }
      } catch (error: any) {
        if (error.message === "disconnect") {
          await disconnect();
          router.refresh();
          return;
        }
        console.error("Error fetching stats:", error);
      }
    };

    loadStory();
    getStats();
    const interval = setInterval(getStats, 300000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return <p className={styles.loading}>Stats Loading...</p>;
  }

  return (
    <div className={styles.statsSide}>
      {/* STATSBOX1 */}
      <div className={styles.boxItem}>
        <div className={styles.boxLabel}>
          <p className={styles.tinyTitle}>Play for glory</p>
        </div>
        <div className={styles.statsBox1}>
          <Rank
            rank={stats ? stats.leagueRank : 0}
            leaguePoints={stats ? stats.leaguePoints : 0}
          />
          <XPBar userLevel={stats.leveling} />
        </div>
      </div>

      {/* STATSBOX2 */}
      <div className={styles.boxItem}>
        <div className={styles.boxLabel}>
          <p className={styles.tinyTitle}>Play for fun</p>
        </div>
        <div className={styles.statsBox2}>
          <Item title="Story Level">
            <StoryLevel storyLevel={storyLevel} />
          </Item>
          <Achievement profile={profile} />
        </div>
      </div>
    </div>
  );
}
