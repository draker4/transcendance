import styles from "@/styles/profile/Achievements/Achievements.module.css";
import { useEffect, useState } from "react";
import AchievementService from "@/services/Achievement.service";
import disconnect from "@/lib/disconnect/disconnect";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FullAchivement, UserAchievement } from "@transcendence/shared/types/Achievement.types";
import HeaderAchievement from "./HeaderAchievement";
import AchievementItem from "./AchievementItem";

type Props = {
  profile: Profile;
};

export default function SectionAchievements({ profile }: Props) {

  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const achievementService = new AchievementService();
  const router = useRouter();

  useEffect(() => {
    const getUserAchievements = async () => {
      try {
        const res = await achievementService.getAllAchievement(profile.id);

        if (!res.success)
          throw new Error('cannot get achievements');

        const data: FullAchivement = res.data;

        setAchievements(data.achievement);
      }
      catch (error: any) {
        if (error.message === 'disconnect') {
          await disconnect();
          router.refresh();
          return ;
        }
        toast.error("Something went wrong, please refresh the page!");
      }
    }

    getUserAchievements();
  }, []);

  const list = achievements.map(achievement => {
		return (
      <div
        className={styles.gridItem}
        key={achievement.id}
        style={{
          opacity: achievement.completed ? 1 : 0.4,
          boxShadow: achievement.completed && !achievement.collected
                    ? "0px 0px 50px var(--achievement)"
                    : undefined,
          cursor: achievement.completed && !achievement.collected
                    ? "pointer"
                    : "default",
          borderColor: achievement.completed && !achievement.collected
                    ? "var(--achievement)"
                    : "var(--tertiary3)",
        }}
      >
        <AchievementItem achievement={achievement} />
      </div>
    );
	});

  return (
    <div className={styles.main}>

      {/* Header */}
			<HeaderAchievement achievements={achievements} />

      {/* Separator */}
      <div className={styles.line}></div>

      {/* achievements list */}
        <div className={styles.grid}>
          {list}
        </div>
		</div>
  )
}
