"use client";

import React, { useState } from "react";
import styles from "@/styles/lobby/League/League.module.css";
import Image from "next/image";

type Props = {
  Lobby: any;
  isLoading: boolean;
};

export default function League({ Lobby, isLoading }: Props) {
  // -------------------------------------Matchmake-------------------------------------//

  //True si en matchmake
  const [inMatchMaking, setinMatchMake] = useState(false);

  //Fonction pour rejoindre une game
  const Start_Matchmake = async () => {
    //Lance la recherche de game
    const res = await Lobby.Start_Matchmaking();
    setinMatchMake(res);
  };

  //Fonction pour commencer la recherche une game
  const Stop_Matchmake = async () => {
    await Lobby.Stop_Matchmaking();
    setinMatchMake(false);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (inMatchMaking) {
    return (
      <div className={styles.league}>
        <Image
          src={`/images/game/balls.gif`}
          alt="Searching giff"
          width="120"
          height="120"
        />
        <button className={styles.button_back_card} onClick={Stop_Matchmake}>
          <p>Stop searching</p>
        </button>
      </div>
    );
  }
  return (
    <div className={styles.league}>
      <button className={styles.button_back_card} onClick={Start_Matchmake}>
        <p>Start searching</p>
      </button>
    </div>
  );
}
