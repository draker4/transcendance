"use client";

import React, { useState } from "react";
import styles from "@/styles/lobby/party/CreateParty.module.css";

import Lobby_Service from "@/services/Lobby.service";
import DefineType from "@/components/lobby/party/DefineType";
import DefineField from "@/components/lobby/party/DefineField";
import DefineInvite from "@/components/lobby/party/DefineInvite";

type Props = {
  lobby: Lobby_Service;
  setCreateParty: Function;
  userId: number;
};

export default function CreateParty({ lobby, setCreateParty, userId }: Props) {
  // ------------------------------------  CREATE  ------------------------------------ //
  //Pong Settings
  const [name, setName] = useState<string>("");
  const [push, setPush] = useState<boolean>(false);
  const [maxPoint, setMaxPoint] = useState<3 | 4 | 5 | 6 | 7 | 8 | 9>(3);
  const [maxRound, setMaxRound] = useState<1 | 3 | 5 | 7 | 9>(3);
  const [hostSide, setHostSide] = useState<"Left" | "Right">("Left");
  const [background, setBackground] = useState<string>("background/0");
  const [ball, setBall] = useState<string>("ball/0");
  const [type, setType] = useState<
    "Classic" | "Best3" | "Best5" | "Custom" | "Training"
  >("Classic");
  const difficulty: 1 | 2 | 3 | 4 | 5 = 3;

  //Fonction pour rejoindre une game
  const Create_Game = async () => {
    //Creer un objet avec les settings
    const settings: GameDTO = {
      name: name,
      type: type,
      mode: "Party",
      host: userId,
      opponent: -1,
      hostSide: hostSide,
      maxPoint: maxPoint,
      maxRound: maxRound,
      difficulty: difficulty,
      push: push,
      background: background,
      ball: ball,
    };
    console.log("Create: " + JSON.stringify(settings));

    //Creer la game
    const res = await lobby.CreateGame(settings);
  };

  const resetCreate = () => {
    setName("");
    setPush(false);
    setMaxPoint(3);
    setMaxRound(1);
    setHostSide("Left");
    setBackground("background/0");
    setBall("ball/0");
    setType("Classic");
    setCreateParty(false);
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
            maxPoint={maxPoint}
            setMaxPoint={setMaxPoint}
            maxRound={maxRound}
            setMaxRound={setMaxRound}
            type={type}
            setType={setType}
            hostSide={hostSide}
            setHostSide={setHostSide}
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
      <div className={styles.invite}>
        <label className={styles.section}>Invite</label>
        <DefineInvite />
      </div>
      <div className={styles.confirm}>
        <button className={styles.save} type="button" onClick={Create_Game}>
          Create Game
        </button>
        <button className={styles.cancel} type="button" onClick={resetCreate}>
          Cancel
        </button>
      </div>
    </div>
  );
}
