import styles from "@/styles/profile/AvatarCard.module.css"
import Profile from "@/services/Profile.service"
import Avatar from "./Avatar"
import ProfileLogin from "./ProfileLogin"

type Props = {
    profile: Profile;
}

export default function AvatarCard({profile} : Props) {
  return (
	<div className={`${styles.avatarCard}`}>
		<Avatar profile={profile}/>
		<ProfileLogin profile={profile}/>
	</div>
  )
}
