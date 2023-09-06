import styles from "@/styles/profile/Achievements/LastAchievements.module.css";
import { useEffect, useState } from "react";
import AchievementService from "@/services/Achievement.service";
import disconnect from "@/lib/disconnect/disconnect";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserAchievement } from "@transcendence/shared/types/Achievement.types";
import ShortAchievementItem from "./ShortAchievementItem";
import StatsService from "@/services/Stats.service";

type Props = {
  profile: Profile;
  setStats: Function;
  statsService: StatsService;
};

export default function LastAchievements({
  profile,
  setStats,
  statsService,
}: Props) {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const achievementService = new AchievementService();
  const router = useRouter();

  const getUserAchievements = async () => {
    try {
      const res = await achievementService.getLast(profile.id);

      if (!res.success) throw new Error("cannot get achievements");

      const data: UserAchievement[] = res.data;

      setAchievements(data);
    } catch (error: any) {
      if (error.message === "disconnect") {
        await disconnect();
        router.refresh();
        return;
      }
      toast.error("Something went wrong, please refresh the page!");
    }
  };

  useEffect(() => {
    getUserAchievements();
  }, []);

  const collectXP = async (achievement: UserAchievement) => {
    if (achievement.collected || !achievement.completed) return;

    try {
      await achievementService.collectAchievement(
        profile.id,
        achievement.id.toString()
      );
      await getUserAchievements();
      const res = await statsService.getShortStats(profile.id);
      if (res.success) setStats(res.data);
      toast.info(`${achievement.xp}xp collected!`);
    } catch (error: any) {
      console.log(error);
      if (error.message === "disconnect") {
        await disconnect();
        router.refresh();
        return;
      }
      toast.error("Something went wrong, please try again!");
    }
  };

  const list = achievements.map((achievement) => {
    return (
      <div
        className={styles.gridItem}
        key={achievement.id}
        style={{
          opacity: achievement.completed ? 1 : 0.4,
          boxShadow:
            achievement.completed && !achievement.collected
              ? "0px 0px 50px var(--achievement)"
              : undefined,
          cursor:
            achievement.completed && !achievement.collected
              ? "pointer"
              : "default",
          borderColor:
            achievement.completed && !achievement.collected
              ? "var(--achievement)"
              : "var(--tertiary3)",
        }}
        onClick={() => collectXP(achievement)}
      >
        <ShortAchievementItem achievement={achievement} />
      </div>
    );
  });

  return <div className={styles.lastAchievements}>{list}</div>;
}
