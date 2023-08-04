//Server side rendering

// Import des composants react
import { Suspense } from "react";

// Import du style
import styles from "@/styles/game/Game.module.css";

// Import des composants projets
import { cookies } from "next/dist/client/components/headers";
import LoadingSuspense from "@/components/loading/LoadingSuspense";
import Game from "@/components/game/Game";
import { Refresher } from "@/components/refresher/Refresher";

// Import des services
import ProfileService from "@/services/Profile.service";

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

  try {
    token = cookies().get("crunchy-token")?.value;
    if (!token) throw new Error("No token value");

    const profileService = new ProfileService(token);
    profile = await profileService.getProfileByToken();
  } catch (err) {
    console.log(err);
  }

  return (
    <main className={styles.gamePage}>
      <Refresher />
      <Suspense fallback={<LoadingSuspense />}>
        <Game profile={profile} token={token} gameId={gameId} />
      </Suspense>
    </main>
  );
}
