//Server side rendering
import Profile from "@/services/Profile.service";
import { getProfileByToken } from "@/lib/profile/getProfileInfos";
import { cookies } from "next/dist/client/components/headers";

//Import le composant pour le lobby
import styles from "@/styles/lobby/Lobby.module.css";
import Lobby from "@/components/lobby/Lobby";
import HomeProfile from "@/components/lobby/HomeProfile";

export default async function Lobby_Frame() {
  let profile = new Profile();
  let token: string | undefined;

  //Recupere le token et le profil de l'utilisateur
  try {
    token = cookies().get("crunchy-token")?.value;
    if (!token) throw new Error("No token value");

    profile = await getProfileByToken(token);
  } catch (err) {
    console.log(err);
  }

  return (
    <main className={styles.First_Frame}>
      <HomeProfile profile={profile} />
      <Lobby profile={profile} token={token} />
    </main>
  );
}
