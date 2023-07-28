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
    </div>
  );
}
