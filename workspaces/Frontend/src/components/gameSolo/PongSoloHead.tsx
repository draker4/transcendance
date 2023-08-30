"use client";

// Import du style
import styles from "@/styles/gameSolo/PongHeadSolo.module.css";

// Import GameLogic
import { GameData } from "@transcendence/shared/types/Game.types";
import { MdClose } from "react-icons/md";
import TrainingService from "@/services/Training.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Props = {
  gameData: GameData;
  trainingService: TrainingService;
};

export default function PongHead({ gameData, trainingService }: Props) {
  const router = useRouter();
  async function quitTraining() {
    if (gameData && gameData.status !== "Finished") {
      const ret = await trainingService.quitTraining(gameData.id);
      await toast.promise(new Promise((resolve) => resolve(ret)), {
        pending: "Leaving training...",
        success: "You have left this training",
        error: "Error leaving training",
      });
    }
    router.push("/home");
  }

  return (
    <div className={styles.pongHead}>
      <div className={styles.leftBlock}></div>
      <h2 className={styles.title}>{gameData.name}</h2>
      <button onClick={quitTraining} className={styles.quitBtn}>
        <MdClose />
      </button>
    </div>
  );
}
