"use client";

import React, { use } from "react";
import styles from "@/styles/game/old/game_infos.module.css";

import Image from "next/image";

export default function Matchmaking_Game_Infos({ game }: { game: any }) {
  return (
    <div className={styles.game_infos}>
      <div className={styles.name_box}>
        <p>{game.Name}</p>
      </div>
      <div className={styles.avatar_host}>
        {/* <p>{game.Host}</p> */}
        <Image
          src={`/images/game/check.png`}
          alt="one_game"
          width="50"
          height="50"
        />
      </div>
      <div className={styles.vs}>
        <Image
          src={`/images/game/vs.png`}
          alt="one_game"
          width="50"
          height="50"
        />
      </div>
      <div className={styles.avatar_opponent}>
        <Image
          src={`/images/game/check.png`}
          alt="one_game"
          width="50"
          height="50"
        />
        {/* <p>{game.Opponent}</p> */}
      </div>
      <div className={styles.status}>
        {game.Status == "Waiting" && <p>Waiting</p>}
        {game.Status == "In progress" && <p>In progress</p>}
      </div>
      <div className={styles.score}>
        <p>
          {game.Score_Host} / {game.Score_Opponent}
        </p>
      </div>
    </div>
  );
}
