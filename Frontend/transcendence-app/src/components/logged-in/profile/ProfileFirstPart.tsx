import styles from "@/styles/profile/Profile.module.css"
import Profile from "@/services/Profile.service"
import AvatarCard from "./avatar/AvatarCard"

type Props = {
    profile: Profile;
	isOwner: boolean;
}

export default function ProfileFirstPart({profile, isOwner} : Props) {
  return (
	<div className={`${styles.both} ${styles.first}`}>
		<AvatarCard profile={profile} isOwner={isOwner}/>
	</div>
  )
}
