"use client";

import React, { useState } from "react";
import styles from "@/styles/lobby/Party/CreateParty.module.css";

import Lobby_Service from "@/services/Lobby.service";
import DefineType from "@/components/lobby/Party/DefineType";
import DefineField from "@/components/lobby/Party/DefineField";

type Props = {
  Lobby: Lobby_Service;
};

export default function CreateParty({ Lobby }: Props) {
  // ------------------------------------  CREATE  ------------------------------------ //

  //Pong Settings

  const [name, setName] = useState<string>("");
  const [push, setPush] = useState<boolean>(false);
  const [score, setScore] = useState<3 | 4 | 5 | 6 | 7 | 8 | 9>(3);
  const [round, setRound] = useState<1 | 3 | 5 | 7 | 9>(3);
  const [side, setSide] = useState<"left" | "right">("left");
  const [background, setBackground] = useState<string>("background/0");
  const [ball, setBall] = useState<string>("ball/0");
  const [type, setType] = useState<string>("classic");

  //Fonction pour rejoindre une game
  const Create_Game = async () => {
    //Creer un objet avec les settings
    const settings: Game_Settings = {
      name: name,
      push: push,
      score: score,
      round: round,
      side: side,
      background: background,
      ball: ball,
      type: type,
    };

    //Creer la game
    const res = await Lobby.Create_Game(settings);
  };

  // -------------------------------------  RENDU  ------------------------------------ //

  return (
    <div className={styles.createParty}>
      <div className={styles.name}>
        <label className={styles.section}>Party Name</label>
        <input
          className={styles.nameInput}
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className={styles.define}>
        <div className={styles.settings}>
          <label className={styles.section}>Define Party Settings</label>
          <DefineType
            push={push}
            setPush={setPush}
            score={score}
            setScore={setScore}
            round={round}
            setRound={setRound}
            type={type}
            setType={setType}
            side={side}
            setSide={setSide}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.section}>Define Party Field</label>
          <DefineField
            background={background}
            setBackground={setBackground}
            ball={ball}
            setBall={setBall}
          />
        </div>
      </div>
      <button className={styles.save} type="button" onClick={Create_Game}>
        Create Game
      </button>
      <button className={styles.save} type="button" onClick={Create_Game}>
        Cancel
      </button>
    </div>
  );
}
