import styles from "@/styles/profile/Profile.module.css"
import ProfileFirstPart from "./ProfileFirstPart"
import ProfileSecondPart from "./ProfileSecondPart"

export default function ProfileMainFrame() {



  return (
	<div className={styles.profileMainFrame}>
		<ProfileFirstPart />
		<ProfileSecondPart />
	</div>
  )
}
