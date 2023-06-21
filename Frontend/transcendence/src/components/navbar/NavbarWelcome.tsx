"use client";

import styles from "@/styles/navbar/NavbarWelcome.module.css";
import Image from "next/image";
import Link from "next/link";

export default function NavbarWelcome() {
  return (
    <nav className={styles.main}>
      <div>
        <Link href="/welcome">
          <Image
            src="/images/logo.png"
            alt="Logo Crunchy Pong"
            width={50}
            height={50}
            title="Logo Crunchy Pong"
            className={styles.logo}
          />
        </Link>
        <Link href="/welcome/login">
          <button type="button" title="Log Button" className={styles.logIn}>
            Log In
          </button>
        </Link>
      </div>
    </nav>
  );
}
