import styles from "@/styles/pong/Selector.module.css";

type Props = {
  id: string;
  value: boolean;
  setValue: Function;
};

export default function Selector({ id, value, setValue }: Props) {
  const handleChangeFalse = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    if (value) {
      setValue(false);
    }
  };
  const handleChangeTrue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    if (!value) {
      setValue(true);
    }
  };
  return (
    <div className={styles.selector}>
      <button
        id={id}
        name="ai"
        value="yes"
        className={value ? styles.activeButton : styles.inactiveButton}
        onClick={handleChangeTrue}
      >
        Yes
      </button>
      <button
        id={id}
        name="ai"
        value="no"
        className={!value ? styles.activeButton : styles.inactiveButton}
        onClick={handleChangeFalse}
      >
        No
      </button>
    </div>
  );
}
