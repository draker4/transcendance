//Server side rendering
import { cookies } from "next/dist/client/components/headers";

//Import le composant pour le lobby
import styles from "@/styles/lobby/Lobby.module.css";
import Lobby from "@/components/lobby/Lobby";
import HomeProfile from "@/components/lobby/HomeProfile";
import Profile_Service from "@/services/Profile.service";
import { Refresher } from "@/components/refresher/Refresher";

export default async function HomePage() {
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

  //Recupere le token et le profil de l'utilisateur
  try {
    token = cookies().get("crunchy-token")?.value;
    if (!token) throw new Error("No token value");

    // bperriol: J'ai changé ca pour chercher avec le service [!]
    const profileData = new Profile_Service(token);
    profile = await profileData.getProfileByToken();
  } catch (err) {
    console.log(err);
  }

  return (
    <div className={styles.home}>
      <Refresher />
      <HomeProfile profile={profile} />
      <Lobby profile={profile} token={token} />
    </div>
  );
}
