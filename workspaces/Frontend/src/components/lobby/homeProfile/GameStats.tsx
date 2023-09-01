import styles from "@/styles/lobby/homeProfile/GameStats.module.css";
import StatsService from "@/services/Stats.service";
import { useState, useEffect } from "react";
import { StatsImproved } from "@transcendence/shared/types/Stats.types";

type Props = {
  profile: Profile;
};

export default function GameStats({ profile }: Props) {
  const statsService = new StatsService();
  const [stats, setStats] = useState<StatsImproved | undefined>(undefined);
  useEffect(() => {
    const getStats = async () => {
      try {
        const ret = await statsService.getFullStats(profile.id);
        setStats(ret.data);
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
      <div>{`total games played: ${stats.gameWon + stats.gameLost}`}</div>
    </div>
  );
}
