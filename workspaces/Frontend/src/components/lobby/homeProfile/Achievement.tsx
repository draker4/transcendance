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
};

export default function achievement({ profile }: Props) {
  const achievementService = new AchievementService();
  const [userachievement, setUserachievement] = useState<
    UserAchievement | undefined
  >(undefined);
  const router = useRouter();

  useEffect(() => {
    const getachievement = async () => {
      try {
        const ret = await achievementService.getUserAchievement(profile.id);
        if (ret.success) setUserachievement(ret.data);
        else throw new Error("get achievement failed");
      } catch (error: any) {
        if (error.message === "disconnect") {
          await disconnect();
          router.refresh();
          return;
        }
        console.error("Error fetching achievement:", error.message);
        toast.error("Something went wrong, please try again!");
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

  if (userachievement.lastThree.length === 0) {
    return (
      <div className={styles.achievement}>
        <h3 className={styles.achievementItemTitle}>No achievement yet</h3>
      </div>
    );
  }

  return (
    <div className={styles.achievement}>
      {userachievement.lastThree.map((achievement) => (
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
