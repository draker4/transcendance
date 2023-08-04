"use client";
import styles from "@/styles/lobby/party/Custom.module.css";

import Selector from "@/components/lobby/selector/Selector";
import Slider from "@/components/lobby/selector/Slider";

type Props = {
  maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  setMaxPoint: Function;
  maxRound: 1 | 3 | 5 | 7 | 9;
  setMaxRound: Function;
  push: boolean;
  setPush: Function;
  pause: boolean;
  setPause: Function;
};

export default function Custom({
  maxPoint,
  setMaxPoint,
  maxRound,
  setMaxRound,
  push,
  setPush,
  pause,
  setPause,
}: Props) {
  // ----------------------------------  CHARGEMENT  ---------------------------------- //

  // -------------------------------------  RENDU  ------------------------------------ //

  return (
    <div className={styles.custom}>
      {/* Score */}
      <div className={styles.score}>
        <label className={styles.section}>Score</label>
        <Slider
          min={3}
          max={9}
          step={1}
          value={maxPoint}
          setValue={setMaxPoint}
        />
      </div>

      {/* Round */}
      <div className={styles.round}>
        <label className={styles.section}>Round</label>
        <Slider
          min={1}
          max={9}
          step={2}
          value={maxRound}
          setValue={setMaxRound}
        />
      </div>

      {/* Push */}
      <div className={styles.push}>
        <label className={styles.section}>Push</label>
        <Selector id="push" value={push} setValue={setPush} />
      </div>

      {/* Pause */}
      <div className={styles.pause}>
        <label className={styles.section}>Pause</label>
        <Selector id="pause" value={pause} setValue={setPause} />
      </div>
    </div>
  );
}
