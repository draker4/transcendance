import styles from "@/styles/profile/Profile.module.css"
import InfoCard from "./infos/InfoCard"
import Profile from "@/services/Profile.service"

type Props = {
    profile: Profile;
}

export default function ProfileSecondPart({profile} : Props) {
  return (
	<div className={styles.both + ' ' + styles.second}>
		<InfoCard profile={profile}/>
	</div>
  )
}
