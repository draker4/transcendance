"use client";

import Link from "next/link";
import styles from "@/styles/gameSolo/ErrorGameSolo.module.css";
import HelpIcon from "@mui/icons-material/Help";

export default function ErrorGameSolo() {
  return (
    <main className={styles.main}>
      <p className={styles.icon}>
        <HelpIcon fontSize="inherit" />
      </p>
      <h1>Oops, this training could not be load...</h1>
      <h4>Try again later!</h4>
      {/* <p className={styles.error}>{errorMsg}</p> */}
      <Link href={"/home"} className={styles.link}>
        Return to Home
      </Link>
    </main>
  );
}
