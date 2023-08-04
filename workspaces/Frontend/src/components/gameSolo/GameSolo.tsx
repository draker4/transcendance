"use client";

// Import des composants react
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Import du style
import styles from "@/styles/game/Game.module.css";

// Import des services
import TrainingService from "@/services/Training.service";

// Import des composants
import { MdLogout } from "react-icons/md";
import { GameData } from "@transcendence/shared/types/Game.types";
import { toast } from "react-toastify";
import PongSolo from "./PongSolo";
import ErrorGameSolo from "./ErrorGameSolo";

type Props = {
  profile: Profile;
  trainingId: string;
};

export default function Game({ profile, trainingId }: Props) {
  const router = useRouter();
  const trainingService = new TrainingService();

  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState<GameData>();
  const [error, setError] = useState<boolean>(false);

  //------------------------------------Chargement------------------------------------//

  useEffect(() => {
    const getData = async () => {
      if (isLoading) {
        const ret = await trainingService.getTrainingData(trainingId);
        if (ret.success == false) {
          setError(true);
        } else {
          setGameData(ret.data);
          setIsLoading(false);
        }
      }
    };
    getData();
  }, []);

  async function quitTraining() {
    const ret = await trainingService.quitTraining(trainingId);
    await toast.promise(new Promise((resolve) => resolve(ret)), {
      pending: "Leaving training...",
      success: "You have left this training",
      error: "Error leaving training",
    });
    router.push("/home");
  }

  //------------------------------------RENDU------------------------------------//

  //Si une erreur est survenue
  if (error) {
    return <ErrorGameSolo />;
  }

  //Si la page n'est pas chargé
  if (isLoading) {
    return (
      <div className={styles.gameLoading}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!isLoading && gameData) {
    return (
      <div className={styles.game}>
        <PongSolo gameData={gameData} setGameData={setGameData}></PongSolo>
        <button onClick={quitTraining} className={styles.quitBtn}>
          <MdLogout />
          <p className={styles.btnTitle}>Leave</p>
        </button>
      </div>
    );
  }
}
