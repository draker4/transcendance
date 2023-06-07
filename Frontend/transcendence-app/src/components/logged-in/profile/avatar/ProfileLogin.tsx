import styles from "@/styles/profile/AvatarCard.module.css"
import Profile from "@/services/Profile.service";

type Props = {
    profile: Profile;
}

export default function ProfileLogin({profile} : Props) {
  return (
	<div className={styles.login}>
		<h1>{profile.login}</h1>
	</div>
  )
}
