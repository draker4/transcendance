"use client";

import { Dispatch, SetStateAction } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmileWink, faFeather, faStarHalfStroke, faTableTennisPaddleBall, faTimes } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import styles from "@/styles/profile/InfoCard.module.css"

type Props = {
	activeButton: number;
	setActiveButton: Dispatch<SetStateAction<number>>
}

type ButtonData = {
	id: number;
	name: string;
	icon: IconProp;
}



export default function NavbarProfilInfo({activeButton, setActiveButton} : Props) {

	const handleClick = (buttonId: number) => {
		setActiveButton(buttonId);
	}
	
	const buttonData: ButtonData[] = [
		{ id: 0, name: 'overview',  icon: faStarHalfStroke},
		{ id: 1, name: 'section 2', icon: faTableTennisPaddleBall },
		{ id: 2, name: 'section 3', icon: faFaceSmileWink },
		{ id: 3, name: 'section 4', icon: faFeather }
	];
	
	
	return (
		<div className={styles.navbar}>
			{ buttonData.map((button) => (
					<div  key={button.id} className={styles.button} onClick={ () => handleClick(button.id) }>
						<FontAwesomeIcon icon={button.icon}/>
						<div>{button.name}</div>
					</div>
				)
			)}
		</div>
	)
}