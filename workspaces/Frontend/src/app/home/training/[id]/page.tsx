//Server side rendering

// //Import des composants react
import { Suspense } from "react";

// Import du style
import styles from "@/styles/gameSolo/GameSolo.module.css";

// Import des composants projets
import { cookies } from "next/dist/client/components/headers";
import { Refresher } from "@/components/refresher/Refresher";
import LoadingSuspense from "@/components/loading/LoadingSuspense";
import GameSolo from "@/components/gameSolo/GameSolo";
import ErrorGameSolo from "@/components/gameSolo/ErrorGameSolo";

// Import des services
import ProfileService from "@/services/Profile.service";
import TrainingService from "@/services/Training.service";

// Import des types
import { GameData } from "@transcendence/shared/types/Game.types";

export default async function TrainingPage({ params }: any) {
  let error = false;
  let profile: Profile = {
    id: -1,
    login: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    image: "",
    provider: "",
    motto: "",
    story: "",
  };
  let token: string | undefined;
  let trainingId = params.id;
  let gameData: GameData | undefined;

  try {
    token = cookies().get("crunchy-token")?.value;
    if (!token) throw new Error("No token value");

    const profileService = new ProfileService(token);
    profile = await profileService.getProfileByToken();

    const trainingService = new TrainingService(token);
    const ret = await trainingService.getTrainingData(trainingId);
    if (ret.success == false) {
      error = true;
    } else {
      gameData = ret.data;
    }
  } catch (err) {
    console.log(err);
    error = true;
  }
  if (
    error ||
    (gameData &&
      ((gameData.hostSide === "Left" &&
        gameData.playerLeft.id !== profile.id) ||
        (gameData.hostSide === "Right" &&
          gameData.playerRight.id !== profile.id)))
  ) {
    return <ErrorGameSolo />;
  }

  return (
    <main className={styles.trainingPage}>
      <Refresher />
      <Suspense fallback={<LoadingSuspense />}>
        {gameData && <GameSolo data={gameData} />}
      </Suspense>
    </main>
  );
}
