"use client";

import { useState } from "react";
import styles from "@/styles/lobby/training/Training.module.css";
import StandardTraining from "./StandardTraining";
import CustomTraining from "./CustomTraining";
import SideSelector from "@/components/lobby/selector/SideSelector";
import Slider from "@/components/lobby/selector/Slider";

type Props = {
  hostSide: "Left" | "Right";
  setHostSide: Function;
  difficulty: 1 | 2 | 3 | 4 | 5;
  setDifficulty: Function;
};

export default function GeneralSettings({
  hostSide,
  setHostSide,
  difficulty,
  setDifficulty,
}: Props) {
  // -------------------------------------Traning-------------------------------------//

  return (
    <div className={styles.generalSettings}>
      {/* Side */}
      <div className={styles.side}>
        <label className={styles.section}>Side</label>
        <SideSelector id="hostSide" value={hostSide} setValue={setHostSide} />
      </div>
      {/* Difficulty */}
      <div className={styles.difficulty}>
        <label className={styles.section}>difficulty</label>
        <Slider
          min={1}
          max={5}
          step={1}
          value={difficulty}
          setValue={setDifficulty}
        />
      </div>
    </div>
  );
}
