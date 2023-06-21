import styles from "@/styles/profile/AvatarCard.module.css"

export default function EditButton() {
  return (
	<div className={styles.editButtonFrame}>
		<div className={styles.editButtonBox}>
			<div className={styles.littleButton}>
				<h3>Edit</h3>
			</div>
		</div>
	</div>
  )
}
