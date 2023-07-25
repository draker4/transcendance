"use client";

import styles from "@/styles/lobby/party/DefineType.module.css";
import { MdStar, Md3GMobiledata, Md5G, MdSettings } from "react-icons/md";
import { useEffect } from "react";

import SideSelector from "@/components/lobby/selector/SideSelector";
import Custom from "@/components/lobby/party/Custom";

type Props = {
  push: boolean;
  setPush: Function;
  maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  setMaxPoint: Function;
  maxRound: 1 | 3 | 5 | 7 | 9;
  setMaxRound: Function;
  type: string;
  setType: Function;
  hostSide: "Left" | "Right";
  setHostSide: Function;
};

export default function DefineType({
  push,
  setPush,
  maxPoint,
  setMaxPoint,
  maxRound,
  setMaxRound,
  type,
  setType,
  hostSide,
  setHostSide,
}: Props) {
  // ----------------------------------  CHANGEMENT  ---------------------------------- //

  // reset settings
  useEffect(() => {
    setType("Classic");
    setHostSide("Left");
  }, [setType, setHostSide]);

  const setClassic = () => {
    setPush(false);
    setMaxPoint(9);
    setMaxRound(1);
    setType("Classic");
  };

  const setBest3 = () => {
    setPush(true);
    setMaxPoint(5);
    setMaxRound(3);
    setType("Best3");
  };

  const setBest5 = () => {
    setPush(true);
    setMaxPoint(5);
    setMaxRound(5);
    setType("Best5");
  };

  const setCustom = () => {
    setPush(false);
    setMaxPoint(3);
    setMaxRound(1);
    setType("Custom");
  };

  // -------------------------------------  RENDU  ------------------------------------ //

  return (
    <div className={styles.defineType}>
      <div className={styles.type}>
        {/* Classic */}
        <button
          className={type === "Classic" ? styles.activeBtn : styles.inactiveBtn}
          onClick={setClassic}
        >
          <MdStar size={40} />
          <h3>Classic</h3>
        </button>

        {/* Best 3 */}
        <button
          className={type === "Best3" ? styles.activeBtn : styles.inactiveBtn}
          onClick={setBest3}
        >
          <Md3GMobiledata size={40} />
          <h3>Best 3</h3>
        </button>

        {/* Best 5 */}
        <button
          className={type === "Best5" ? styles.activeBtn : styles.inactiveBtn}
          onClick={setBest5}
        >
          <Md5G size={40} />
          <h3>Best 5</h3>
        </button>

        {/* Custom */}
        <button
          className={type === "Custom" ? styles.activeBtn : styles.inactiveBtn}
          onClick={setCustom}
        >
          <MdSettings size={40} />
          <h3>Custom</h3>
        </button>
      </div>
      <div className={styles.side}>
        <label className={styles.section}>Side</label>
        <SideSelector id="hostSide" value={hostSide} setValue={setHostSide} />
      </div>
      {type === "Custom" && (
        <Custom
          push={push}
          setPush={setPush}
          maxPoint={maxPoint}
          setMaxPoint={setMaxPoint}
          maxRound={maxRound}
          setMaxRound={setMaxRound}
        />
      )}
    </div>
  );
}
