"use client";

import styles from "@/styles/navbar/Navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import Theme from "../theme/Theme";

export default function NavbarWelcome() {
  return (
    <nav className={styles.nav}>
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
      <Theme />
      <Link href="/welcome/login" prefetch>
        <button type="button" title="Log Button" className={styles.logIn}>
          Log In
        </button>
      </Link>
    </nav>
  );
}
