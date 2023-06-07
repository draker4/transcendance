import styles from "@/styles/profile/AvatarCard.module.css"
import pickups from "@/styles/pickUpBox/pickUpButtons.module.css"


export default function EditButton() {
  return (
	<div className={styles.editButtonFrame}>
		<div className={styles.editButtonBox}>
			<div className={pickups.littleButton}>
				<h3>Edit</h3>
			</div>
		</div>
	</div>
  )
}
