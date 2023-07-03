//Server side rendering

//Merdouille pour les cookies
import Profile from "@/services/Profile.service"; 
import { getProfileByToken } from "@/lib/profile/getProfileInfos";
import { cookies } from 'next/dist/client/components/headers';

//Import le composant pour le lobby
import styles from '@/styles/game/game.module.css'
// import Game_Lobby from '@/components/game/Game_Lobby'

export default async function GameLobby() {
    
    let profile = new Profile();
    let token : string | undefined;

    try {
        token = cookies().get("crunchy-token")?.value;
        if (!token)
            throw new Error("No token value");

        profile = await getProfileByToken(token);
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



