"use client";

import styles from "@/styles/lobby/party/DefineType.module.css";
import { MdStar, Md3GMobiledata, Md5G, MdSettings } from "react-icons/md";
import { useEffect } from "react";

import SideSelector from "@/components/lobby/selector/SideSelector";
import Custom from "@/components/lobby/party/Custom";

type Props = {
  push: boolean;
  setPush: Function;
  score: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  setScore: Function;
  round: 1 | 3 | 5 | 7 | 9;
  setRound: Function;
  type: string;
  setType: Function;
  side: "left" | "right";
  setSide: Function;
};

export default function DefineType({
  push,
  setPush,
  score,
  setScore,
  round,
  setRound,
  type,
  setType,
  side,
  setSide,
}: Props) {
  // ----------------------------------  CHANGEMENT  ---------------------------------- //

  // reset settings
  useEffect(() => {
    setType("classic");
    setSide("left");
  }, [setType, setSide]);

  const setClassic = () => {
    setPush(false);
    setScore(9);
    setRound(1);
    setType("classic");
  };

  const setBest3 = () => {
    setPush(true);
    setScore(5);
    setRound(3);
    setType("best3");
  };

  const setBest5 = () => {
    setPush(true);
    setScore(5);
    setRound(5);
    setType("best5");
  };

  const setCustom = () => {
    setPush(false);
    setScore(3);
    setRound(1);
    setType("custom");
  };

  // -------------------------------------  RENDU  ------------------------------------ //

  return (
    <div className={styles.defineType}>
      <label className={styles.section}>Type</label>
      <div className={styles.type}>
        {/* Classic */}
        <button
          className={type === "classic" ? styles.activeBtn : styles.inactiveBtn}
          onClick={setClassic}
        >
          <MdStar size={40} />
          <h3>Classic</h3>
        </button>

        {/* Best 3 */}
        <button
          className={type === "best3" ? styles.activeBtn : styles.inactiveBtn}
          onClick={setBest3}
        >
          <Md3GMobiledata size={40} />
          <h3>Best 3</h3>
        </button>

        {/* Best 5 */}
        <button
          className={type === "best5" ? styles.activeBtn : styles.inactiveBtn}
          onClick={setBest5}
        >
          <Md5G size={40} />
          <h3>Best 5</h3>
        </button>

        {/* Custom */}
        <button
          className={type === "custom" ? styles.activeBtn : styles.inactiveBtn}
          onClick={setCustom}
        >
          <MdSettings size={40} />
          <h3>Custom</h3>
        </button>
      </div>
      <div className={styles.side}>
        <label className={styles.section}>Side</label>
        <SideSelector id="side" value={side} setValue={setSide} />
      </div>
      {type === "custom" && (
        <Custom
          push={push}
          setPush={setPush}
          score={score}
          setScore={setScore}
          round={round}
          setRound={setRound}
        />
      )}
    </div>
  );
}
