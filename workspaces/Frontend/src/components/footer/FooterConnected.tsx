import styles from "@/styles/footer/footer.module.css";
import Link from "next/link";

export default function FooterConnected({ profile }: {
  profile: Profile;
}) {

	return (
		<footer className={styles.footer}>

			<div className={styles.line}></div>

				<div className={styles.horizontal}>

					<div className={styles.title}>
						<h5>Crunchy Pong</h5>
						<p>Let's play together</p>
					</div>

					<div className={styles.refsConnected}>
						<Link href={"/home"} className={styles.link}>
							Home Page
						</Link>
						<Link href={`/home/profile/${profile.id}`} className={styles.link}>
							My Profile
						</Link>
						<Link href={"/home/chat"} className={styles.link}>
							My Chat
						</Link>
						<Link href={"/welcome/disconnect"} className={styles.link} prefetch={false} >
							Log Out
						</Link>
					</div>

				</div>

			<div className={styles.copyright}>&copy;CrunchyTeam 2023</div>

		</footer>
	);
}
