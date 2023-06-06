import styles from "@/styles/profile/Profile.module.css"
import Profile from "@/services/Profile.service"
import Avatar from "./Avatar"

type Props = {
    profile: Profile;
}

export default function ProfileFirstPart({profile} : Props) {
  return (
	<div className={`${styles.both} ${styles.first}`}>
		<Avatar profile={profile}/>
	</div>
  )
}
