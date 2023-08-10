"use client"

import React from "react";
import styles from "@/styles/welcome/Welcome.module.css";
import { useParams } from "next/navigation";
import DisconnectClient from "../disconnect/DisconnectClient";

export default function Welcome() {
  const notif = useParams().notif;

  if (notif && notif[0] === "notif") {
    return (
      <div className={styles.main}>
        <DisconnectClient />
        <p>Crunchy Pong!</p>
      </div>
    )
  }

  return (
    <div className={styles.main}>
      <p>Crunchy Pong!</p>
    </div>
  );
}
