// Import du style
import styles from "@/styles/game/Game.module.css";

import Game from "./Game";
import { cookies } from "next/headers";
import ProfileService from "@/services/Profile.service";
import Link from "next/link";

export default async function GameServer({
  gameId,
}: {
  gameId: string | undefined;
}) {
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

  try {
    const getToken = cookies().get("crunchy-token")?.value;
    if (!getToken) throw new Error("No token value");

    token = getToken;

    const profileService = new ProfileService(token);
    profile = await profileService.getProfileByToken();
    if (profile.id === -1) throw new Error("no user");
  } catch (err) {
    console.log(err);
    return (
      <div className={styles.error}>
        <h2>Oops... Something went wrong!</h2>
        <Link href={"/home"} className={styles.errorLink}>
          <p>Return to Home Page!</p>
        </Link>
      </div>
    );
  }

  return (
    <main className={styles.gamePage}>
      <Game profile={profile} token={token} gameId={gameId} />
    </main>
  );
}
