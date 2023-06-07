import styles from "@/styles/profile/AvatarCard.module.css"
import Profile from "@/services/Profile.service";
import EditButton from "./EditButton";

type Props = {
    profile: Profile;
}

export default function ProfileLogin({profile} : Props) {
	const isProfilOwner = true;
	
	return (
	<div className={styles.loginCard}>
		<div className={styles.login}>
			<h1>{profile.login}</h1>
		</div>
		{isProfilOwner && <EditButton />}
	</div>
  )
}
