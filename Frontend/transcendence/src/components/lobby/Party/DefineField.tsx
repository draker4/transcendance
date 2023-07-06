"use client";

import React, { useEffect } from "react";
import styles from "@/styles/lobby/Party/Party.module.css";
import ImgSelector from "@/components/lobby/Selector/ImgSelector";

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
    setBackground("background/0");
    setBall("ball/0");
  }, [setBackground, setBall]);

  return (
    <div className={styles.fieldSelector}>
      {/* Background */}
      <label>Background</label>
      <ImgSelector
        value={background}
        setValue={setBackground}
        imgs={["background/0", "background/1", "background/2", "background/3"]}
        width={100}
        height={100}
      />

      {/* Ball */}
      <label>Ball</label>
      <ImgSelector
        value={ball}
        setValue={setBall}
        imgs={["ball/0", "ball/1", "ball/2", "ball/3"]}
        width={30}
        height={30}
      />
    </div>
  );
}
