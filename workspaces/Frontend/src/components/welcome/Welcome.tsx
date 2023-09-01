"use client";

import styles from "@/styles/welcome/Welcome.module.css";
import { useParams } from "next/navigation";
import DisconnectClient from "../disconnect/DisconnectClient";
import { confirmBackground, confirmBall } from "@/lib/game/random";
import { useState } from "react";
import Demo from "@/components/demo/Demo";

export default function Welcome() {
  const notif = useParams().notif;
  const [showDemo, setShowDemo] = useState<boolean>(true);
  const [showClassic, setShowClassic] = useState<boolean>(false);
  const [showCrunchy, setShowCrunchy] = useState<boolean>(false);
  const classic: CreateDemo = {
    name: `Classic`,
    type: "Custom",
    side: "Left",
    maxPoint: 9,
    maxRound: 1,
    difficulty: -2,
    push: false,
    pause: false,
    background: confirmBackground("Classic"),
    ball: confirmBall("Classic"),
  };
  const crunchy: CreateDemo = {
    name: `Crunchy Pong`,
    type: "Custom",
    side: "Right",
    maxPoint: 9,
    maxRound: 5,
    difficulty: 2,
    push: true,
    pause: true,
    background: confirmBackground("Random"),
    ball: confirmBall("Random"),
  };

  return (
    <div className={styles.welcome}>
      {notif && notif[0] === "notif" && <DisconnectClient />}
      <div className={styles.demo}>
        {!showCrunchy && !showClassic && (
          <button
            onClick={() => setShowClassic(true)}
            className={styles.demoBtn}
            type="button"
          >
            Show Classic
          </button>
        )}
        {!showCrunchy && !showClassic && (
          <button
            onClick={() => setShowCrunchy(true)}
            className={styles.demoBtn}
            type="button"
          >
            Show Crunchy
          </button>
        )}
        {showClassic && (
          <Demo
            login={"Grandpa"}
            demoData={classic}
            setShowDemo={setShowClassic}
          />
        )}
        {showCrunchy && (
          <Demo login={"You"} demoData={crunchy} setShowDemo={setShowCrunchy} />
        )}
      </div>
    </div>
  );
}
