"use client";

import styles from "@/styles/lobby/training/Training.module.css";
import ImgSelector from "@/components/lobby/selector/ImgSelector";
import Selector from "@/components/lobby/selector/Selector";
import Slider from "@/components/lobby/selector/Slider";

type Props = {
  selected: string;
  setSelected: Function;
  maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  setMaxPoint: Function;
  maxRound: 1 | 3 | 5 | 7 | 9;
  setMaxRound: Function;
  push: boolean;
  setPush: Function;
  background: string;
  setBackground: Function;
  ball: string;
  setBall: Function;
};

export default function CustomTraining({
  selected,
  setSelected,
  maxPoint,
  setMaxPoint,
  maxRound,
  setMaxRound,
  push,
  setPush,
  background,
  setBackground,
  ball,
  setBall,
}: Props) {
  // -------------------------------------Traning-------------------------------------//

  const handleChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setSelected("Custom");
  };

  if (selected !== "Custom") {
    return (
      <button
        className={styles.customBtn}
        onClick={(event) => handleChange(event)}
      >
        Custom
      </button>
    );
  }
  return (
    <div className={styles.customTraining}>
      <h2>Custom</h2>
      <div className={styles.settings}>
        {/* Push */}
        <label className={styles.section}>Push</label>
        <Selector id="push" value={push} setValue={setPush} />

        {/* Score */}
        <label className={styles.section}>Score</label>
        <Slider
          min={3}
          max={9}
          step={1}
          value={maxPoint}
          setValue={setMaxPoint}
        />

        {/* Round */}
        <label className={styles.section}>Round</label>
        <Slider
          min={1}
          max={9}
          step={2}
          value={maxRound}
          setValue={setMaxRound}
        />
      </div>

      <div className={styles.styles}>
        {/* Background */}
        <label className={styles.section}>Background</label>
        <ImgSelector
          type={"background"}
          value={background}
          setValue={setBackground}
          imgs={[
            "Classic",
            "Earth",
            "Football",
            "Island",
            "Rugby",
            "Tennis",
            "Winter",
            "Random",
          ]}
          width={135}
          height={80}
          disabled={false}
        />

        {/* Ball */}
        <label className={styles.section}>Ball</label>
        <ImgSelector
          type={"ball"}
          value={ball}
          setValue={setBall}
          imgs={[
            "Classic",
            "Basket",
            "Bowling1",
            "Bowling2",
            "Bowling3",
            "Football",
            "Soccer1",
            "Soccer2",
            "Soccer3",
            "Soccer4",
            "Volley1",
            "Volley2",
            "Random",
          ]}
          width={30}
          height={30}
          disabled={false}
        />
      </div>
    </div>
  );
}
