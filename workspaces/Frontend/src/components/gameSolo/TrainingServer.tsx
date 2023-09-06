// Import du style
import styles from "@/styles/game/Game.module.css";

// Import des composants projets
import { cookies } from "next/dist/client/components/headers";
import GameSolo from "@/components/gameSolo/GameSolo";
import ErrorGameSolo from "@/components/gameSolo/ErrorGameSolo";

// Import des services
import ProfileService from "@/services/Profile.service";

// Import des types
import { GameData } from "@transcendence/shared/types/Game.types";

export default async function GameServer({
  trainingId,
}: {
  trainingId: string;
}) {
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
    gameKey: "Arrow",
  };
  let token: string | undefined;
  let gameData: GameData | undefined;

  try {
    const getToken = cookies().get("crunchy-token")?.value;
    if (!getToken) throw new Error("No token value");

    token = getToken;

    const profileService = new ProfileService(token);
    profile = await profileService.getProfileByToken();
    if (profile.id === -1) throw new Error("no user");
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
    <main className={styles.gamePage}>
      <GameSolo profile={profile} trainingId={trainingId} />
    </main>
  );
}
