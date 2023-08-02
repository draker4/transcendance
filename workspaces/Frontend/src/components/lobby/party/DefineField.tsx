"use client";

import React, { useEffect } from "react";
import styles from "@/styles/lobby/party/DefineField.module.css";
import ImgSelector from "@/components/lobby/selector/ImgSelector";
import {
  BACKGROUND,
  BALL,
} from "@transcendence/shared/constants/Asset.constants";

type Props = {
  background: string;
  setBackground: Function;
  ball: string;
  setBall: Function;
  type: "Classic" | "Best3" | "Best5" | "Custom" | "Training";
};

export default function DefineField({
  background,
  setBackground,
  ball,
  setBall,
  type,
}: Props) {
  // ----------------------------------  CHARGEMENT  ---------------------------------- //

  // reset settings
  useEffect(() => {
    setBackground("Classic");
    setBall("Classic");
  }, [setBackground, setBall]);

  return (
    <div className={styles.fieldSelector}>
      {/* Background */}
      <ImgSelector
        type={"background"}
        value={background}
        setValue={setBackground}
        imgs={BACKGROUND}
        width={135}
        height={80}
        disabled={type === "Classic"}
      />

      {/* Ball */}
      <label className={styles.section}>Ball</label>
      <ImgSelector
        type={"ball"}
        value={ball}
        setValue={setBall}
        imgs={BALL}
        width={30}
        height={30}
        disabled={type === "Classic"}
      />
    </div>
  );
}
