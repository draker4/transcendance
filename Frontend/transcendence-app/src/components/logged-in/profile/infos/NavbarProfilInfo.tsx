"use client";

import { useState, Dispatch, SetStateAction } from "react"
import Profile from "@/services/Profile.service"

type Props = {
	activeButton: number;
	setActiveButton: Dispatch<SetStateAction<number>>
}

type ButtonData = {
	id: number;
	name: string;
}



export default function NavbarProfilInfo({activeButton, setActiveButton} : Props) {

	const handleClick = (buttonId: number) => {
		setActiveButton(buttonId);
	}
	
	const buttonData: ButtonData[] = [
		{ id: 0, name: 'overview' },
		{ id: 1, name: 'section 1' },
		{ id: 2, name: 'section 2' },
		{ id: 3, name: 'section 3' }
	];
	
	
	return (
		<nav>
			{ buttonData.map((button) => (
					<button onClick={ () => handleClick(button.id) }>
						{button.name}
					</button>
				)
			)}
		</nav>
	)
}
