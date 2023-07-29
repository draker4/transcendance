"use client";

import { useState } from "react";
import styles from "@/styles/lobby/training/Training.module.css";
import StandardTraining from "./define/StandardTraining";
import CustomTraining from "./define/CustomTraining";
import GeneralSettings from "./define/GeneralSettings";

type Props = {
  profile: Profile;
};

export default function Training({ profile }: Props) {
  const [selected, setSelected] = useState<
    "Classic" | "Best3" | "Best5" | "Random" | "Custom"
  >("Classic");
  const [type, setType] = useState<"Classic" | "Best3" | "Best5" | "Custom">(
    "Classic"
  );
  const [maxPoint, setMaxPoint] = useState<3 | 4 | 5 | 6 | 7 | 8 | 9>(3);
  const [maxRound, setMaxRound] = useState<1 | 3 | 5 | 7 | 9>(3);
  const [hostSide, setHostSide] = useState<"Left" | "Right">("Left");
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [push, setPush] = useState<boolean>(false);
  const [background, setBackground] = useState<string>("Classic");
  const [ball, setBall] = useState<string>("Classic");

  // -------------------------------------Traning-------------------------------------//

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
      <button className={styles.save}>Create Game</button>
    </div>
  );
}
