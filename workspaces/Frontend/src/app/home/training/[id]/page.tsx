//Server side rendering

//Merdouille pour les cookies
import { cookies } from "next/dist/client/components/headers";

//Import le composant pour le lobby
import styles from "@/styles/game/Game.module.css";
import Profile_Service from "@/services/Profile.service";
import { Refresher } from "@/components/refresher/Refresher";
import { Suspense } from "react";
import LoadingSuspense from "@/components/loading/LoadingSuspense";

import GameSolo from "@/components/gameSolo/GameSolo";
import { GameData } from "@transcendence/shared/types/Game.types";

export default async function GamePage({ params }: any) {
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
  let gameId = params.id;
  // const gameData: GameData; //;

  try {
    token = cookies().get("crunchy-token")?.value;
    if (!token) throw new Error("No token value");

    const profileData = new Profile_Service(token);
    profile = await profileData.getProfileByToken();
  } catch (err) {
    console.log(err);
  }

  return (
    <main className={styles.gamePage}>
      <Refresher />
      <Suspense fallback={<LoadingSuspense />}>
        {/* <GameSolo profile={profile} gameData={gameData} /> */}
      </Suspense>
    </main>
  );
}
