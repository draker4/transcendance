"use client";

import styles from "@/styles/lobby/training/story/StorySelector.module.css";
import Image from "next/image";

type Props = {
  title: string;
  points: number;
  rounds: number;
  img: string;
  level: number;
  levelSelected: number;
  setLevelSelected: Function;
};

export default function StorySelector({
  title,
  points,
  rounds,
  img,
  level,
  levelSelected,
  setLevelSelected,
}: Props) {
  // -------------------------------------Traning-------------------------------------//
  const handleChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setLevelSelected(level - 1);
  };

  return (
    <div className={styles.storySelector}>
      <h3>{`Level ${level}`}</h3>
      <button
        className={level === levelSelected ? styles.active : styles.inactive}
        key={title}
        onClick={(event) => handleChange(event)}
      >
        <h4>{`${title}`}</h4>
        <div className={styles.info}>
          <p>{`Points: ${points === 0 ? "?" : points}`}</p>
          <p>{`Rounds: ${rounds === 0 ? "?" : rounds}`}</p>
        </div>
        <div>
          <Image
            src={`/images/background/${img}.png`}
            alt={img}
            width={135}
            height={80}
          />
        </div>
      </button>
    </div>
  );
}
