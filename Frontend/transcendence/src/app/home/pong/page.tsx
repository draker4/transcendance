"use client";
import Pong from "@/components/pong/Pong";
import PongSettings from "@/components/pong/PongSettings";
import styles from "@/styles/pong/pongPage.module.css";
import { useState } from "react";

export default function Home() {
  const [pong, setPong] = useState<Pong>({
    AI: true,
    push: true,
    score: 3,
    round: 3,
    difficulty: 1,
    side: "left",
  });
  const [settings, setSettings] = useState<boolean>(false);
  return (
    <main className={styles.main}>
      {!settings ? (
        <PongSettings pong={pong} setSettings={setSettings} setPong={setPong} />
      ) : (
        <Pong pong={pong} />
      )}
    </main>
  );
}
