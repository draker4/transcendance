//Server side rendering

//Merdouille pour les cookies
import Profile from "@/services/Profile.service";
import { getProfileByToken } from "@/lib/profile/getProfileInfos";
import { cookies } from "next/dist/client/components/headers";

//Import le composant pour le lobby
import styles from "@/styles/game/game.module.css";
import Game from "@/components/game/Game";

export default async function GamePage({ params, searchParams }: any) {
  let profile = new Profile();
  let token: string | undefined;
  let gameID = params.id;

  try {
    token = cookies().get("crunchy-token")?.value;
    if (!token) throw new Error("No token value");

    profile = await getProfileByToken(token);
  } catch (err) {
    console.log(err);
  }

  return (
    <main className={styles.First_Frame}>
      <Game profile={profile} token={token} gameID={gameID} />
    </main>
  );
}
