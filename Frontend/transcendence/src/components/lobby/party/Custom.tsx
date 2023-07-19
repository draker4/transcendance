"use client";
import styles from "@/styles/lobby/party/Custom.module.css";

import Selector from "@/components/lobby/selector/Selector";
import Slider from "@/components/lobby/selector/Slider";

type Props = {
  push: boolean;
  setPush: Function;
  maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  setMaxPoint: Function;
  maxRound: 1 | 3 | 5 | 7 | 9;
  setMaxRound: Function;
};

export default function Custom({
  push,
  setPush,
  maxPoint,
  setMaxPoint,
  maxRound,
  setMaxRound,
}: Props) {
  // ----------------------------------  CHARGEMENT  ---------------------------------- //

  // -------------------------------------  RENDU  ------------------------------------ //

  return (
    <div className={styles.customs}>
      {/* Push */}
      <label className={styles.section}>Push</label>
      <Selector id="push" value={push} setValue={setPush} />

      {/* Score */}
      <label className={styles.section}>Score</label>
      <Slider
        min={3}
        max={9}
        step={1}
        value={maxPoint}
        setValue={setMaxPoint}
      />

      {/* Round */}
      <label className={styles.section}>Round</label>
      <Slider
        min={1}
        max={9}
        step={2}
        value={maxRound}
        setValue={setMaxRound}
      />
    </div>
  );
}
