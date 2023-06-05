import Profile from "@/services/Profile.service";
import styles from "@/styles/LoupTest/ProfileCard2.module.css"
import ProfileCard2 from "./ProfileCard2";

type Props = {
    profile: Profile;
}

export default function ProfileUserFrame({profile} : Props) {
  
  
  
  const content = (
    
    <div className={styles.frame}>
      <ProfileCard2 profile={profile}/>
    </div>
    
    );
  
    return content;
}
