"use client";
import { PongColors } from "@/lib/enums/PongColors.enum";
import styles from "@/styles/createLogin/ChooseColor.module.css";
import { ReactNode, useState } from "react";

export default function ChooseColor({
  onSelect,
}: {
  onSelect: (color: string) => void;
}) {
  const [colorClass, setColorClass] = useState<string>(PongColors.appleGreen);

  const allColors = [
    PongColors.paprika,
    PongColors.fuschia,
    PongColors.mauve,
    PongColors.violet,
    PongColors.navyBlue,
    PongColors.blue,
    PongColors.skyBlue,
    PongColors.turquoise,
    PongColors.emerald,
    PongColors.grassGreen,
    PongColors.appleGreen,
    PongColors.limeGreen,
    PongColors.canaryYellow,
    PongColors.yellow,
    PongColors.mustardYellow,
    PongColors.tangerine,
    PongColors.nightblue,
    PongColors.gray,
  ];

  const handleSelect = (color: string) => {
    setColorClass(color);
    onSelect(color);
  };

  const renderColor = () => {
    return allColors.map((color) => (
      <div
        key={color}
        className={`${styles.cercle} ${
          colorClass === color ? styles.selected : ""
        }`}
        style={{ backgroundColor: color }}
        onClick={() => handleSelect(color)}
      ></div>
    ));
  };

  return (
    <div className={styles.main}>
      {renderColor()}
      {/* <div
        className={`${styles.cercle} ${
          colorClass === "#22d3ee" ? styles.selected : ""
        }`}
        style={{ backgroundColor: "#22d3ee" }}
        onClick={() => handleSelect("#22d3ee")}
      ></div>
      <div
        className={`${styles.cercle} ${
          colorClass === "#cdb4db" ? styles.selected : ""
        }`}
        style={{ backgroundColor: "#cdb4db" }}
        onClick={() => handleSelect("#cdb4db")}
      ></div>
      <div
        className={`${styles.cercle} ${
          colorClass === "#ffc8dd" ? styles.selected : ""
        }`}
        style={{ backgroundColor: "#ffc8dd" }}
        onClick={() => handleSelect("#ffc8dd")}
      ></div>
      <div
        className={`${styles.cercle} ${
          colorClass === "#ffafcc" ? styles.selected : ""
        }`}
        style={{ backgroundColor: "#ffafcc" }}
        onClick={() => handleSelect("#ffafcc")}
      ></div>
      <div
        className={`${styles.cercle} ${
          colorClass === "#bde0fe" ? styles.selected : ""
        }`}
        style={{ backgroundColor: "#bde0fe" }}
        onClick={() => handleSelect("#bde0fe")}
      ></div>
      <div
        className={`${styles.cercle} ${
          colorClass === "#a2d2ff" ? styles.selected : ""
        }`}
        style={{ backgroundColor: "#a2d2ff" }}
        onClick={() => handleSelect("#a2d2ff")}
      ></div>
      <div
        className={`${styles.cercle} ${
          colorClass === "#3a86ff" ? styles.selected : ""
        }`}
        style={{ backgroundColor: "#3a86ff" }}
        onClick={() => handleSelect("#3a86ff")}
      ></div>
      <div
        className={`${styles.cercle} ${
          colorClass === "#219ebc" ? styles.selected : ""
        }`}
        style={{ backgroundColor: "#219ebc" }}
        onClick={() => handleSelect("#219ebc")}
      ></div>
      <div
        className={`${styles.cercle} ${
          colorClass === "#ffbe0b" ? styles.selected : ""
        }`}
        style={{ backgroundColor: "#ffbe0b" }}
        onClick={() => handleSelect("#ffbe0b")}
      ></div>
      <div
        className={`${styles.cercle} ${
          colorClass === "#fb8500" ? styles.selected : ""
        }`}
        style={{ backgroundColor: "#fb8500" }}
        onClick={() => handleSelect("#fb8500")}
      ></div>
      <div
        className={`${styles.cercle} ${
          colorClass === "#c1121f" ? styles.selected : ""
        }`}
        style={{ backgroundColor: "#c1121f" }}
        onClick={() => handleSelect("#c1121f")}
      ></div>
      <div
        className={`${styles.cercle} ${
          colorClass === "#023047" ? styles.selected : ""
        }`}
        style={{ backgroundColor: "#023047" }}
        onClick={() => handleSelect("#023047")}
      ></div> */}
    </div>
  );
}
