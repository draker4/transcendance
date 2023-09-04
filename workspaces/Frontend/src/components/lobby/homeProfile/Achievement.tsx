"use client";

import AchievementService from "@/services/Achievement.service";
import styles from "@/styles/lobby/homeProfile/HomeProfile.module.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UserAchievement } from "@transcendence/shared/types/Achievement.types";
import LoadingComponent from "@/components/loading/Loading";
import { toast } from "react-toastify";
import disconnect from "@/lib/disconnect/disconnect";
import { useRouter } from "next/navigation";

type Props = {
  profile: Profile;
  setShowAchievement: Dispatch<SetStateAction<boolean>>

};

export default function achievement({ profile, setShowAchievement }: Props) {
  const achievementService = new AchievementService();
  const [userachievement, setUserachievement] = useState<
    UserAchievement | undefined
  >(undefined);
  const router = useRouter();

  useEffect(() => {
    const getachievement = async () => {
      try {
        const ret = await achievementService.getUserAchievement(profile.id);
        if (ret.success)
          setUserachievement(ret.data);
        else
          throw new Error('get achchievement failed');
      } catch (error:any) {
        if (error.message === "disconnect") {
          await disconnect();
          router.refresh();
          return ;
        }
        console.error("Error fetching achievement:", error.message);
        toast.error("Something went wrong, please try again!");
        setShowAchievement(false);
      }
    };

    getachievement();
  }, []);

  if (!userachievement) {
    return (
      <div className={styles.achievement}>
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className={styles.achievement}>
      {userachievement.list.map((achievement) => (
        <div className={styles.achievementItem}>
          <h3 className={styles.achievementItemTitle}>{achievement.name}</h3>
          <p className={styles.achievementItemDescription}>
            {achievement.description}
          </p>
          <p></p>
        </div>
      ))}
    </div>
  );
}
