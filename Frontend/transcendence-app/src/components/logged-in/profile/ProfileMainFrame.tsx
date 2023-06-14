import styles from "@/styles/profile/Profile.module.css"
import Profile from "@/services/Profile.service";
import ProfileFirstPart from "./ProfileFirstPart"
import ProfileSecondPart from "./ProfileSecondPart"

type Props = {
    profile: Profile;
	isOwner: boolean;
}

export default function ProfileMainFrame({profile, isOwner} : Props) {



  return (
	<div className={styles.profileMainFrame}>
		<ProfileFirstPart profile={profile} isOwner={isOwner}/>
		<ProfileSecondPart profile={profile} isOwner={isOwner}/>
	</div>
  )
}
