"use client";

import AchievementService from "@/services/Achievement.service";
import styles from "@/styles/lobby/homeProfile/AnnonceAchievement.module.css";
import { useState } from "react";
import { FullAchievement } from "@transcendence/shared/types/Achievement.types";
import LoadingComponent from "@/components/loading/Loading";
import { toast } from "react-toastify";
import disconnect from "@/lib/disconnect/disconnect";
import { useRouter } from "next/navigation";

type Props = {
  toBeAnnonced: FullAchievement[];
  achievementService: AchievementService;
  profile: Profile;
};

export default function AnnonceAchievement({
  toBeAnnonced,
  achievementService,
  profile,
}: Props) {
  const [annonce, setAnnonce] = useState<FullAchievement | undefined>(
    toBeAnnonced.shift()
  );
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const confirmAchivement = async () => {
    try {
      if (!annonce) return;
      setLoading(true);
      const res = await achievementService.achievementAnnonced(
        profile.id,
        annonce.id
      );
      setAnnonce(toBeAnnonced.shift());
      setLoading(false);
    } catch (error: any) {
      if (error.message === "disconnect") {
        await disconnect();
        router.refresh();
        return;
      }
      toast.info("Something went wrong, please try again!");
    }
  };

  if (!annonce) return;

  return (
    <div className={styles.annonceAchievement}>
      <h3 className={styles.achievementTitle}>{annonce.name}</h3>
      <p className={styles.achievementDescription}>{annonce.description}</p>
      <h4 className={styles.achievementXP}>{`You win ${annonce.xp} xp`}</h4>
      <button className={styles.confirmBtn}>
        {!loading && "Confirm"}
        {loading && <LoadingComponent />}
      </button>
    </div>
  );
}
