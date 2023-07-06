import styles from "@/styles/lobby/Selector/ImgSelector.module.css";
import Image from "next/image";

type Props = {
  value: string;
  setValue: Function;
  imgs: string[];
  width: number;
  height: number;
};

export default function ImgSelector({
  value,
  setValue,
  imgs,
  width,
  height,
}: Props) {
  const handleChange = (
    event: React.MouseEvent<HTMLButtonElement>,
    img: string
  ) => {
    event?.preventDefault();
    setValue(img);
  };

  return (
    <div className={styles.imgList}>
      {imgs.map((img: string, index: number) => (
        <button
          className={
            value === img ? styles.activeButton : styles.inactiveButton
          }
          key={index}
          onClick={(event) => handleChange(event, img)}
        >
          <Image
            src={`/images/game/${img}.png`}
            alt={img}
            width={width}
            height={height}
          />
        </button>
      ))}
    </div>
  );
}
