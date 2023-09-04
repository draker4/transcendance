"use client";

import AchievementService from "@/services/Achievement.service";
import styles from "@/styles/lobby/homeProfile/HomeProfile.module.css";
import { useEffect, useState } from "react";
import { UserAchievement } from "@transcendence/shared/types/Achievement.types";
import LoadingComponent from "@/components/loading/Loading";

type Props = {
  profile: Profile;
};

export default function achievement({ profile }: Props) {
  const achievementService = new AchievementService();
  const [userachievement, setUserachievement] = useState<
    UserAchievement | undefined
  >(undefined);

  useEffect(() => {
    const getachievement = async () => {
      try {
        const ret = await achievementService.getUserAchievement(profile.id);
        console.log("ret", ret);
        if (ret.success) {
          setUserachievement(ret.data);
        } else {
          console.log("Error fetching achievement:", ret);
        }
      } catch (error) {
        console.error("Error fetching achievement:", error);
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
