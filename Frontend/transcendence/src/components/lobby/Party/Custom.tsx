"use client";

import React, { useEffect } from "react";
import styles from "@/styles/lobby/Flip_Card.module.css";

import Selector from "@/components/lobby/Selector/Selector";
import Slider from "@/components/lobby/Selector/Slider";

type Props = {
  push: boolean;
  setPush: Function;
  score: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  setScore: Function;
  round: 1 | 3 | 5 | 7 | 9;
  setRound: Function;
};

export default function Custom({
  push,
  setPush,
  score,
  setScore,
  round,
  setRound,
}: Props) {
  // ----------------------------------  CHARGEMENT  ---------------------------------- //

  // -------------------------------------  RENDU  ------------------------------------ //

  return (
    <div className={styles.customs}>
      {/* Push */}
      <label>Push</label>
      <Selector id="push" value={push} setValue={setPush} />

      {/* Score */}
      <label>Score</label>
      <Slider min={3} max={9} step={1} value={score} setValue={setScore} />

      {/* Round */}
      <label>Round</label>
      <Slider min={1} max={9} step={2} value={round} setValue={setRound} />
    </div>
  );
}
