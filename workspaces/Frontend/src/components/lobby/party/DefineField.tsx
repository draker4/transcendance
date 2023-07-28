"use client";

import React, { useEffect } from "react";
import styles from "@/styles/lobby/party/DefineField.module.css";
import ImgSelector from "@/components/lobby/selector/ImgSelector";

type Props = {
  background: string;
  setBackground: Function;
  ball: string;
  setBall: Function;
};

export default function DefineField({
  background,
  setBackground,
  ball,
  setBall,
}: Props) {
  // ----------------------------------  CHARGEMENT  ---------------------------------- //

  // reset settings
  useEffect(() => {
    setBackground("Earth");
    setBall("0");
  }, [setBackground, setBall]);

  return (
    <div className={styles.fieldSelector}>
      {/* Background */}
      <ImgSelector
        type={"background"}
        value={background}
        setValue={setBackground}
        imgs={["Earth", "Football", "Island", "Rugby", "Tennis", "Winter"]}
        width={135}
        height={80}
      />

      {/* Ball */}
      <label className={styles.section}>Ball</label>
      <ImgSelector
        type={"ball"}
        value={ball}
        setValue={setBall}
        imgs={["0", "1", "2", "3"]}
        width={30}
        height={30}
      />
    </div>
  );
}
