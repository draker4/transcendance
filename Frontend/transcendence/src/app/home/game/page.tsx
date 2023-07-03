//Server side rendering

//Merdouille pour les cookies
import { cookies } from 'next/dist/client/components/headers';

//Import le composant pour le lobby
import styles from '@/styles/game/game.module.css'
import Profile_Service from "@/services/Profile.service";
// import Game_Lobby from '@/components/game/Game_Lobby'

export default async function GameLobby() {
    
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
    let token : string | undefined;

    try {
        token = cookies().get("crunchy-token")?.value;
        if (!token)
            throw new Error("No token value");

        const profileData = new Profile_Service(token);
        profile = await profileData.getProfileByToken();
    }
    catch (err) {
        console.log(err);
    }

    return (
        <main className={styles.First_Frame}>
            {/* <Game_Lobby profile={profile} token={token}/> */}
        </main>
    );
}



