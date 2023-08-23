import styles from "@/styles/profile/InfoCard.module.css";
import ResumeChannel from "./custom channel/ResumeChannel";

type Props = {
  relation: ChannelUsersRelation;
}

export default function SectionChannelStatus({relation}:Props) {
  return (
    <div className={styles.sections}>
      {/* //[+] A TESTER AVEC GRAND NOM DE ChANNEL (bis) */ }
      <p className={`${styles.tinyTitle} ${styles.marginTop}`}>{relation.channel.name}</p>
      <ResumeChannel type={relation.channel.type} />
    </div>
  )
}
