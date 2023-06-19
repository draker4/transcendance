import styles from "@/styles/profile/AvatarCard.module.css"
import { CirclePicker } from 'react-color'

export default function SettingsCard() {
  return (
    <div className={styles.settingsCard}>
       <CirclePicker />
    </div>
  )
}
