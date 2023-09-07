"use client";

import styles from "@/styles/footer/footer.module.css";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import FooterConnected from "./FooterConnected";

export default function Footer({ profile }: { profile: Profile | undefined }) {
  const segment = useSelectedLayoutSegment();
  const pathName = usePathname();

  if (segment === "welcome") {
    return (
      <footer className={styles.footer}>
        <div className={styles.line}></div>

        <div className={styles.horizontal}>
          <div className={styles.title}>
            <h5>&copy;Crunchy Pong 2023</h5>
            <p>Let's play together</p>
          </div>

          <div className={styles.ref}>
            <Link href={"/welcome"} className={styles.link}>
              Welcome
            </Link>
            <Link href={"/welcome/login"} className={styles.link}>
              Log In
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  if (
    !profile ||
    pathName === "/home/auth/2fa" ||
    pathName === "/home/create" ||
    pathName === "/home/auth/connect"
  )
    return (
      <footer className={styles.footer}>
        <div className={styles.line}></div>

        <div className={styles.horizontal}>
          <div className={styles.title}>
            <h5 className={styles.copyright}>&copy;Crunchy Pong 2023</h5>
            <p>Let's play together</p>
          </div>

          <div className={styles.ref}>
            <Link href={"/welcome/disconnect"} className={styles.link}>
              Log Out
            </Link>
          </div>
        </div>
      </footer>
    );

  return <FooterConnected profile={profile} />;
}
