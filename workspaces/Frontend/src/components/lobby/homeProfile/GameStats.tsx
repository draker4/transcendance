import styles from "@/styles/lobby/homeProfile/HomeProfile.module.css";
import StatsService from "@/services/Stats.service";
import { useState, useEffect } from "react";
import { ShortStats } from "@transcendence/shared/types/Stats.types";
import Rank from "@/components/profile/infos/sections/ItemContent/Rank";
import Winrate from "@/components/profile/infos/sections/ItemContent/Winrate";
import disconnect from "@/lib/disconnect/disconnect";
import { useRouter } from "next/navigation";
import XPBar from "@/components/profile/infos/sections/ItemContent/XPBar";

type Props = {
  profile: Profile;
};

export default function GameStats({ profile }: Props) {
  const statsService = new StatsService();
  const [stats, setStats] = useState<ShortStats | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const getStats = async () => {
      try {
        const ret = await statsService.getShortStats(profile.id);
        if (ret.success) {
          setStats(ret.data);
        }
      } catch (error:any) {
        if (error.message === 'disconnect') {
          await disconnect();
          router.refresh();
          return ;
        }
        console.error("Error fetching stats:", error);
      }
    };

    getStats();
    const interval = setInterval(getStats, 300000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return <p className={styles.loading}>Stats Loading...</p>;
  }

  return (
    <div className={styles.gameStats}>
      {/* [+] Leaguepoint a bien importer */}
      <Rank rank={stats ? stats.leagueRank : 0} leaguePoints={stats ? stats.leaguePoints : 0} />
      <XPBar userLevel={stats !== undefined && stats.leveling ? stats.leveling : {level:1, userXp:0, nextLevelXP:100}} />
      {/* [+] en trop
      <Winrate
        winData={{
          gameWon: stats ? stats.gameWon : 0,
          gameLost: stats ? stats.gameLost : 0,
          global: stats ? stats.gameWon + stats.gameLost : 0,
          showPlaceholder: false,
        }}
      />
      */}
    </div>
  );
}
