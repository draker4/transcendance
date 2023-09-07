"use client"

import styles from "@/styles/footer/footer.module.css";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import FooterConnected from "./FooterConnected";

export default function Footer({ profile }: {
	profile: Profile | undefined;
}) {
	const segment = useSelectedLayoutSegment();
	const pathName = usePathname();
	
	if (segment === "welcome") {
		return (
			<footer className={styles.footer}>

				<div className={styles.line}></div>

					<div className={styles.horizontal}>

						<div className={styles.title}>
							<h5>Crunchy Pong</h5>
							<p>Let's play together</p>
						</div>

						<div className={styles.refs}>
							<Link href={"/welcome"} className={styles.link}>
								Welcome Page
							</Link>
							<Link href={"/welcome/login"} className={styles.link}>
								Log In / Register
							</Link>
						</div>

					</div>

				<div className={styles.copyright}>&copy;CrunchyTeam 2023</div>

			</footer>
		);
	}

	if (!profile || pathName === "/home/auth/2fa" || pathName === "/home/create" || pathName === "/home/auth/connect")
		return (
			<footer className={styles.footer}>

				<div className={styles.line}></div>

					<div className={styles.horizontal}>

						<div className={styles.title}>
							<h5>Crunchy Pong</h5>
							<p>Let's play together</p>
						</div>

						<div className={styles.ref}>
							<Link href={"/welcome/disconnect"} className={styles.link} prefetch={false} >
								Log Out
							</Link>
						</div>

					</div>

				<div className={styles.copyright}>&copy;CrunchyTeam 2023</div>

			</footer>
		);

	return <FooterConnected profile={profile} />
}
