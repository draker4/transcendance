"use client";
import React, { useState } from "react";
import styles from "@/styles/lobby/history/History.module.css";
type Props = {
  Matchmaking: any;
  isLoading: boolean;
};

type Game_Settings = {
  name: string;
  push: boolean;
  score: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  round: 1 | 3 | 5 | 7 | 9;
  difficulty: 1 | 2 | 3 | 4 | 5;
  side: "left" | "right";
  background: string;
  ball: string;
  paddle: string;
  type: string;
  mode: string;
};

export default function History({ Matchmaking, isLoading }: Props) {
  // -------------------------------------Matchmake-------------------------------------//
  
  //Fonction pour commencer la recherche une game
  const Stop_Matchmake = async () => {
    await Matchmaking.Stop_Matchmaking();
  };

  // -------------------------------------Traning-------------------------------------//

  //Fonction pour rejoindre une game
  const Create_Solo = async () => {
    //Stop le matchmake
    Stop_Matchmake();

    //Rejoins la page de solo training
    Matchmaking.Load_Page("/home/game");
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className={styles.flip_card}>
      <button className={styles.button_back_card} onClick={Create_Solo}>
        <p>Create solo game</p>
      </button>
    </div>
  );
}
