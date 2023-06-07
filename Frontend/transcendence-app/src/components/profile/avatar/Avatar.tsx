import styles from "@/styles/profile/AvatarCard.module.css"
import Profile from "@/services/Profile.service";

type Props = {
    profile: Profile;
}

export default function Avatar({profile} : Props) {



	const avatarAltValue: string = `player ${profile.login}'s avatar`;


  return (
	<div className={styles.avatar}>
		<div className={styles.circle}>
			<img src={profile.image} alt={avatarAltValue} className={styles.image} />
		</div>
	</div>
  )
}
