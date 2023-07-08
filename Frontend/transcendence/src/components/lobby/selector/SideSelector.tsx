import styles from "@/styles/lobby/selector/Selector.module.css";

type Props = {
  id: string;
  value: "left" | "right";
  setValue: Function;
};

export default function Selector({ id, value, setValue }: Props) {
  const handleChangeRight = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    if (value === "left") {
      setValue("right");
    }
  };
  const handleChangeLeft = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    if (value === "right") {
      setValue("left");
    }
  };
  return (
    <div className={styles.sideSelector}>
      <button
        id={id}
        name="sideSelector"
        value="left"
        className={
          value === "left" ? styles.activeButton : styles.inactiveButton
        }
        onClick={handleChangeLeft}
      >
        Left
      </button>
      <button
        id={id}
        name="sideSelector"
        value="right"
        className={
          value === "right" ? styles.activeButton : styles.inactiveButton
        }
        onClick={handleChangeRight}
      >
        Right
      </button>
    </div>
  );
}
