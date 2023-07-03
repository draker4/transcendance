import styles from "@/styles/lobby/ImgSelector.module.css";
import Image from "next/image";

type Props = {
  id: string;
  value: string;
  setValue: Function;
  imgs: string[];
};

export default function ImgSelector({ id, value, setValue, imgs }: Props) {

	const handleChange= (event: React.MouseEvent<HTMLButtonElement>, img: string) => {
		event?.preventDefault();
		setValue(img);
	};

	return (
		<div className={styles.Img_List}>
			{imgs.map((img: string, index: number) => (

				<div className={styles.ImgSelector} key={index}>
					<button 
						className={value === img ? styles.activeButton : styles.inactiveButton}
						onClick={(event) => handleChange(event, img)}>
						{img.split("/")[1]}
						<div className={styles.button_icone}>
                			<Image src={`/images/game/${img}.png`} alt={img} width="30" height="30"/>
            			</div>
					</button>
				</div>

			))}
		</div>
	);
}
