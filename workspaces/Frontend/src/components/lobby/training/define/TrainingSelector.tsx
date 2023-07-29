"use client";

import styles from "@/styles/lobby/training/Training.module.css";
import Image from "next/image";

type Props = {
  title: string;
  points: number;
  rounds: number;
  img: string;
  selected: string;
  setSelected: Function;
};

export default function TrainingSelector({
  title,
  points,
  rounds,
  img,
  selected,
  setSelected,
}: Props) {
  // -------------------------------------Traning-------------------------------------//
  const handleChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setSelected(selected);
  };

  return (
    <button
      className={styles.selectTraining}
      key={title}
      onClick={(event) => handleChange(event)}
    >
      <h2>{`${title}`}</h2>
      <div>
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
  );
}
