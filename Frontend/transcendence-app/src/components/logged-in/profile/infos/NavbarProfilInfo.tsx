"use client";

import { useState, Dispatch, SetStateAction } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmileWink, faGear, faMessage, faTableTennisPaddleBall } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import styles from "@/styles/profile/InfoCard.module.css"

type Props = {
	activeButton: number;
	setActiveButton: Dispatch<SetStateAction<number>>
	isOwner: boolean;
}

type ButtonData = {
	id: number;
	name: string;
	icon: IconProp;
}



export default function NavbarProfilInfo({activeButton, setActiveButton, isOwner} : Props) {

	const [selectedItem, setSelectedItem] = useState(0);

	const handleClick = (buttonId: number) => {
		setActiveButton(buttonId);
		setSelectedItem(buttonId);
	}
	
	const buttonData: ButtonData[] = 
	isOwner ?
	[
		{ id: 0, name: 'PongStats',  icon: faTableTennisPaddleBall},
		{ id: 1, name: 'Contacts', icon: faFaceSmileWink },
		{ id: 2, name: 'Channels', icon:  faMessage},
		{ id: 3, name: 'Custom', icon: faGear }
	] : [
		{ id: 0, name: 'PongStats',  icon: faTableTennisPaddleBall},
		{ id: 1, name: 'Contacts', icon: faFaceSmileWink },
		{ id: 2, name: 'Channels', icon:  faMessage},
	];

	
	
	return (
		<div className={styles.navbar}>
			{ buttonData.map((button) => (
					<div  key={button.id} className={`${styles.button} ${button.id === selectedItem ? styles.active : ""}`} onClick={ () => handleClick(button.id) }>
						<FontAwesomeIcon icon={button.icon}/>
						<div>{button.name}</div>
					</div>
				)
			)}
		</div>
	)
}