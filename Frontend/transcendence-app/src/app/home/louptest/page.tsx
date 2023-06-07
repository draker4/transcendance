import ProfileCard from "@/components/logged-in/LoupTests/ProfileCard";
import ProfileUserFrame from "@/components/logged-in/LoupTests/ProfileUserFrame";
import { getProfileByToken } from "@/lib/profile/getProfileInfos";
import Profile from "@/services/Profile.service"; 
import styles from "@/styles/LoupTest/ProfileCard.module.css";
import { cookies } from 'next/dist/client/components/headers';


export default async function louptest() {
    
    let profile = new Profile();

    try {
        const token = cookies().get("crunchy-token")?.value;
        if (!token)
            throw new Error("No tken value");

        profile = await getProfileByToken(token);
    }
    catch (err) {
        console.log(err);
    }

    const content = (
        <main className={styles.main}>
                {/* <ProfileUserFrame profile={profile}/> */}
                <ProfileCard profile={profile}/>
        </main>
        )

    return content;
}
