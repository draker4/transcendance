"use client";

import styles from "@/styles/lobby/league/DefineType.module.css";
import { MdStar, Md3GMobiledata, Md5G } from "react-icons/md";
import { useEffect } from "react";

type Props = {
  type: string;
  setType: Function;
};

export default function DefineType({ type, setType }: Props) {
  // ----------------------------------  CHANGEMENT  ---------------------------------- //

  // reset settings
  useEffect(() => {
    setType("classic");
  }, [setType]);

  const setClassic = () => {
    setType("classic");
  };

  const setBest3 = () => {
    setType("3rounds");
  };

  const setBest5 = () => {
    setType("5rounds");
  };

  // -------------------------------------  RENDU  ------------------------------------ //

  return (
    <div className={styles.defineType}>
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
    </div>
  );
}
