import styles from "@/styles/lobby/homeProfile/HomeProfile.module.css";
import StatsService from "@/services/Stats.service";
import { useState, useEffect } from "react";
import {
  ShortStats,
  StatsImproved,
} from "@transcendence/shared/types/Stats.types";
import Rank from "@/components/profile/infos/sections/ItemContent/Rank";
import { UserLeaderboard } from "@transcendence/shared/types/Leaderboard.types";
import LobbyService from "@/services/Lobby.service";
import Winrate from "@/components/profile/infos/sections/ItemContent/Winrate";

type Props = {
  profile: Profile;
};

type MyLeague = {
  rank: number;
  won: number;
  lost: number;
};

export default function GameStats({ profile }: Props) {
  const statsService = new StatsService();
  const lobbyService = new LobbyService();
  const [stats, setStats] = useState<ShortStats | undefined>(undefined);

  useEffect(() => {
    const getStats = async () => {
      try {
        const ret = await statsService.getShortStats(profile.id);
        if (ret.success) {
          setStats(ret.data);
        }
      } catch (error) {
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
      <Rank rank={stats.leagueRank} />
      <Winrate
        winData={{
          gameWon: stats.gameWon,
          gameLost: stats.gameLost,
          global: stats.gameWon + stats.gameLost,
          showPlaceholder: false,
        }}
      />
    </div>
  );
}
