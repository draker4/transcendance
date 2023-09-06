import styles from "@/styles/profile/Achievements/Achievements.module.css";
import { useEffect, useState } from "react";
import AchievementService from "@/services/Achievement.service";
import disconnect from "@/lib/disconnect/disconnect";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FullAchivement, UserAchievement } from "@transcendence/shared/types/Achievement.types";
import HeaderAchievement from "./HeaderAchievement";
import AchievementItem from "./AchievementItem";
import { ShortStats } from "@transcendence/shared/types/Stats.types";
import { Socket } from "socket.io-client";

type Props = {
  profile: Profile;
  socket: Socket | undefined;
};

export default function SectionAchievements({ profile, socket }: Props) {

  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [stats, setstats] = useState<ShortStats | undefined>(undefined);
  const achievementService = new AchievementService();
  const router = useRouter();

  const getUserAchievements = async () => {
    try {
      const res = await achievementService.getAllAchievement(profile.id);

      if (!res.success)
        throw new Error('cannot get achievements');

      const data: FullAchivement = res.data;

      let newAchievements = data.achievement
          .map(achievement => {
            if (profile.provider === '42' && (achievement.code === "VERIFY_EMAIL" || achievement.code === "LOGIN_GOOGLE"))
              return null;
            if (profile.provider === 'google' && (achievement.code === "VERIFY_EMAIL" || achievement.code === "LOGIN_42"))
              return null;
            if (profile.provider === 'email' && (achievement.code === "LOGIN_42" || achievement.code === "LOGIN_GOOGLE"))
              return null;
            return achievement;
          })
          .filter(achievement => achievement !== null) as UserAchievement[];

      setAchievements(newAchievements);
      setstats(data.stats);
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

  useEffect(() => {
    getUserAchievements();

    const updateNotif = (payload: {
      why: string;
    }) => {
      if (payload && payload.why && payload.why === "updateAchievements")
        getUserAchievements();
    };

    socket?.on('achievements', getUserAchievements);
    socket?.on('notif', updateNotif);

    return () => {
      socket?.off('achievements', getUserAchievements);
      socket?.off('notif', updateNotif);
    }
  }, [socket]);

  const  collectXP = async (achievement: UserAchievement) => {
    if (achievement.collected || !achievement.completed)
      return ;

    try {
      await achievementService.collectAchievement(
        profile.id, achievement.id.toString()
      );
      toast.info(`${achievement.xp}xp collected!`);
      socket?.emit('notif', {
        why: "updateAchievements",
      });
    }
    catch (error: any) {
      console.log(error);
      if (error.message === 'disconnect') {
        await disconnect();
        router.refresh();
        return ;
      }
      toast.error('Something went wrong, please try again!');
    }
  }

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
        onClick={() => collectXP(achievement)}
      >
        <AchievementItem achievement={achievement} stats={stats} />
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
