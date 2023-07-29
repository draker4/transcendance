"use client";

import { useState } from "react";
import styles from "@/styles/lobby/training/Training.module.css";
import StandardTraining from "./StandardTraining";
import CustomTraining from "./CustomTraining";
import GeneralSettings from "./GeneralSettings";
import {
  GameData,
  InitData,
  Player,
} from "@transcendence/shared/types/Game.types";
import { initPong } from "@transcendence/shared/game/initPong";
import { v4 as idv4 } from "uuid";
import { convertColor } from "@transcendence/shared/game/pongUtils";

type Props = {
  profile: Profile;
  avatar: Avatar;
  setGameData: Function;
};

export default function DefineTraining({
  profile,
  avatar,
  setGameData,
}: Props) {
  const [selected, setSelected] = useState<
    "Classic" | "Best3" | "Best5" | "Random" | "Custom"
  >("Classic");
  const [maxPoint, setMaxPoint] = useState<3 | 4 | 5 | 6 | 7 | 8 | 9>(3);
  const [maxRound, setMaxRound] = useState<1 | 3 | 5 | 7 | 9>(3);
  const [hostSide, setHostSide] = useState<"Left" | "Right">("Left");
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [push, setPush] = useState<boolean>(false);
  const [background, setBackground] = useState<string>("Classic");
  const [ball, setBall] = useState<string>("Classic");

  // ----------------------------------  CREATE PONG  --------------------------------- //

  function createPong() {
    const type = selected === "Random" ? "Custom" : selected;
    const initData: InitData = {
      id: idv4(),
      name: `Training ${selected}`,
      type: type,
      mode: "Training",
      maxPoint: maxPoint,
      maxRound: maxRound,
      difficulty: difficulty,
      push: push,
      background: background,
      ball: ball,
    };
    const gameData: GameData = initPong(initData);
    const player: Player = {
      id: profile.id,
      name: profile.login,
      color: convertColor(avatar.borderColor),
      avatar: avatar,
      side: hostSide,
    };
    const AI: Player = {
      id: -2,
      name: `Coach ${selected}`,
      //red color rgba
      color: { r: 232, g: 26, b: 26, a: 1 },
      avatar: {
        image: "",
        variant: "circular",
        borderColor: "#e81a1a",
        backgroundColor: "#e81a1a",
        text: "CO",
        empty: true,
        decrypt: false,
      },
      side: hostSide === "Left" ? "Right" : "Left",
    };
    gameData.playerLeft = hostSide === "Left" ? player : AI;
    gameData.playerRight = hostSide === "Right" ? player : AI;
    console.log(gameData);
    setGameData(gameData);
  }

  // -----------------------------------  TRAINING  ----------------------------------- //

  return (
    <div className={styles.training}>
      <StandardTraining selected={selected} setSelected={setSelected} />
      <CustomTraining
        selected={selected}
        setSelected={setSelected}
        maxPoint={maxPoint}
        setMaxPoint={setMaxPoint}
        maxRound={maxRound}
        setMaxRound={setMaxRound}
        push={push}
        setPush={setPush}
        background={background}
        setBackground={setBackground}
        ball={ball}
        setBall={setBall}
      />
      <GeneralSettings
        hostSide={hostSide}
        setHostSide={setHostSide}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
      <button className={styles.save} onClick={() => createPong()}>
        Play
      </button>
    </div>
  );
}
