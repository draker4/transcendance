import styles from "@/styles/profile/AvatarCard.module.css"
import Profile from "@/services/Profile.service";
import EditButton from "./EditButton";

type Props = {
    profile: Profile;
	isOwner: boolean;
}

export default function ProfileLogin({profile, isOwner} : Props) {
	
	return (
	<div className={styles.loginCard}>
		<div className={styles.login}>
			<h1>{profile.login}</h1>
		</div>
		{isOwner && <EditButton />}
	</div>
  )
}
