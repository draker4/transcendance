import styles from "@/styles/profile/Achievements/Achievements.module.css";
import { useEffect, useState } from "react";
import AchievementService from "@/services/Achievement.service";
import disconnect from "@/lib/disconnect/disconnect";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FullAchievement, UserAchievement } from "@transcendence/shared/types/Achievement.types";
import { LinearProgress, linearProgressClasses } from "@mui/material";
import { styled } from '@mui/material/styles';
import HeaderAchievement from "./HeaderAchievement";
import AchievementItem from "./AchievementItem";

type Props = {
  profile: Profile;
};

export default function SectionAchievements({ profile }: Props) {

  const [achievements, setAchievements] = useState<FullAchievement[]>([]);
  const achievementService = new AchievementService();
  const router = useRouter();

  useEffect(() => {
    const getUserAchievements = async () => {
      try {
        const res = await achievementService.getUserAchievement(profile.id);

        if (!res.success)
          throw new Error('cannot get achievements');

        const data: UserAchievement = res.data;

        setAchievements(data.list);
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
		return <div className={styles.gridItem} key={achievement.id} >
      <AchievementItem achievement={achievement} />
    </div>
	});

  return (
    <div className={styles.main}>

      {/* Header */}
			<HeaderAchievement />

      {/* Separator */}
      <div className={styles.line}></div>

      {/* achievements list */}
        <div className={styles.grid}>
          {list}
        </div>
		</div>
  )
}
