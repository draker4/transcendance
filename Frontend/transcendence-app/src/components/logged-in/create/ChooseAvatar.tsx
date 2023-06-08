"use client"

import Avatar from "@mui/material/Avatar";
import styles from "@/styles/create/ChooseAvatar.module.css";
import { useState } from "react";
import ChooseColor from "./ChooseColor";
import avatarType from "@/types/Avatar.type";

export default function ChooseAvatar({ selectColor, selectAvatar, texts, avatars }: {
	selectColor: (color: string) => void;
	selectAvatar: (avatar: avatarType) => void;
	texts: string[],
	avatars: string[]
}) {
	
	const	[selectedColor, setSelectedColor] = useState('var(--accent-color)');
	const	[selectedAvatar, setSelectedAvatar] = useState<string>(avatars[0]);

	const	handleSelection = (color: string) => {
		setSelectedColor(color);
		selectColor(color);
	}

	const	handleSelectAvatar = (key: string, avatar: {
		image: string,
		variant: string,
		borderColor: string,
		text: string,
		empty: boolean,
	}) => {
		setSelectedAvatar(key);
		selectAvatar(avatar);
	}

	return (
		<div>
			<div className={styles.main}>
				{
					avatars.map(avatar => {

						return (
							<Avatar
								className={`${styles.avatar} ${avatar === selectedAvatar ? styles.selected : ""}`}
								key={avatar}
								src={avatar}
								alt={texts[0]}
								variant="circular"
								onClick={() => handleSelectAvatar(
									avatar,
									{
										image: avatar,
										variant: "circular",
										borderColor: selectedColor,
										text: "",
										empty: false,
									},
								)}
								sx={{
									width: 80,
									height: 80,
									border: `4px solid ${selectedColor}`,
								}}
							>
								{texts[0]}
							</Avatar>
						);
					})
				}
				{
					texts.map(text => {

						return (
							<Avatar
								className={`${styles.avatar} ${text === selectedAvatar ? styles.selected : ""}`}
								key={text}
								variant="circular"
								imgProps={{
									referrerPolicy: "no-referrer",
								}}
								onClick={() => handleSelectAvatar(
									text,
									{
										image: "",
										variant: "circular",
										borderColor: selectedColor,
										text: text,
										empty: false,
									},
								)}
								sx={{
									width: 80,
									height: 80,
									border: `4px solid ${selectedColor}`,
								}}
							>
								{text}
							</Avatar>
						);
					})
				}
				<Avatar
					className={`${styles.avatar} ${"empty" === selectedAvatar ? styles.selected : ""}`}
					variant="circular"
					onClick={() => handleSelectAvatar(
						"empty",
						{
							image: "",
							variant: "circular",
							borderColor: selectedColor,
							text: "",
							empty: true,
						},
					)}
					sx={{
						width: 80,
						height: 80,
						border: `4px solid ${selectedColor}`,
					}}
				/>
			</div>

			<div className={styles.chooseColor}>
				<ChooseColor onSelect={handleSelection}/>
			</div>

		</div>
	);
}
