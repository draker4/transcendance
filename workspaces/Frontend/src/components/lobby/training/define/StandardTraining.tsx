"use client";

import { useState } from "react";
import styles from "@/styles/lobby/training/Training.module.css";
import TrainingSelector from "./TrainingSelector";

type Props = {
  selected: string;
  setSelected: Function;
};

export default function StandardTraining({ setSelected }: Props) {
  // -------------------------------------Traning-------------------------------------//

  return (
    <div className={styles.ChooseTraining}>
      <TrainingSelector
        title="Classic"
        points={9}
        rounds={1}
        img="Classic"
        selected="Classic"
        setSelected={setSelected}
      />
      <TrainingSelector
        title="Best of 3"
        points={7}
        rounds={3}
        img="Earth"
        selected="Best3"
        setSelected={setSelected}
      />
      <TrainingSelector
        title="Best of 5"
        points={5}
        rounds={5}
        img="Island"
        selected="Best5"
        setSelected={setSelected}
      />
      <TrainingSelector
        title="Random"
        points={0}
        rounds={0}
        img="Random"
        selected="Random"
        setSelected={setSelected}
      />
    </div>
  );
}
