import React from "react";
import styles from "@/styles/notLogged/Welcome.module.css";
import Link from "next/link";

export default function Welcome() {
  return (
    <div className={styles.main}>
      <p>Crunchy Pong !</p>
    </div>
  );
}
