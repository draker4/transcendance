import styles from "@/styles/footer/footer.module.css";
import Link from "next/link";

export default function FooterConnected({ profile }: { profile: Profile }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.line}></div>

      <div className={styles.horizontal}>
        <div className={styles.title}>
          <h5 className={styles.copyright}>&copy;Crunchy Pong 2023</h5>
          <p>Let's play together</p>
        </div>

        <div className={styles.ref}>
          <Link href={"/home"} className={styles.link}>
            Home Page
          </Link>
          <Link href={`/home/profile/${profile.id}`} className={styles.link}>
            Profile
          </Link>
          <Link href={"/home/chat"} className={styles.link}>
            Chat
          </Link>
          <Link href={"/welcome/disconnect"} className={styles.link}>
            Log Out
          </Link>
        </div>
      </div>
    </footer>
  );
}
