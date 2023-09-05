import stylesInfoCard from "@/styles/profile/InfoCard.module.css";
import styles from "@/styles/profile/Achievements/Achievements.module.css";
import { useEffect, useState } from "react";
import AchievementService from "@/services/Achievement.service";
import disconnect from "@/lib/disconnect/disconnect";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FullAchievement, UserAchievement } from "@transcendence/shared/types/Achievement.types";

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
		return <div className={styles.gridItem}>
      {achievement.code}
    </div>
	});

  return (
    <div className={stylesInfoCard.sections}>
				<p className={stylesInfoCard.tinyTitle} style={{fontSize: "0.9rem"}}>
					All my Pongies 😎
				</p>
        <div className={styles.grid}>
          {list}
        </div>
		</div>
  )
}
