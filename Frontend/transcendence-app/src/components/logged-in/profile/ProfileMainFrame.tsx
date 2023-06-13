import styles from "@/styles/profile/Profile.module.css"
import Profile from "@/services/Profile.service";
import ProfileFirstPart from "./ProfileFirstPart"
import ProfileSecondPart from "./ProfileSecondPart"

type Props = {
    profile: Profile;
}

export default function ProfileMainFrame({profile} : Props) {



  return (
	<div className={styles.profileMainFrame}>
		<ProfileFirstPart profile={profile}/>
		<ProfileSecondPart profile={profile}/>
	</div>
  )
}
