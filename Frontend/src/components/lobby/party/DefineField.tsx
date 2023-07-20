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
    setBackground("background/Field");
    setBall("ball/0");
  }, [setBackground, setBall]);

  return (
    <div className={styles.fieldSelector}>
      {/* Background */}
      <label className={styles.section}>Background</label>
      <ImgSelector
        value={background}
        setValue={setBackground}
        imgs={[
          "background/Field",
          "background/Football",
          "background/Island",
          "background/Rugby",
          "background/Tennis",
          "background/Winter",
        ]}
        width={135}
        height={80}
      />

      {/* Ball */}
      <label className={styles.section}>Ball</label>
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
