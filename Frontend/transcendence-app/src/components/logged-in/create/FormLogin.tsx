"use client"

import { checkLoginFormat } from "@/lib/create/checkLogin";
import ChooseAvatar from "./ChooseAvatar";
import styles from "@/styles/create/Create.module.css";
import { useEffect, useState } from "react";
import { handleActionServer } from "@/lib/create/handleActionServer";
import { useRouter } from "next/navigation";
import avatarType from "@/types/Avatar.type";

export default function FormLogin({ texts, avatars, token }: {
	texts: string[],
	avatars: string[],
	token: string,
}) {

	const	[notif, setNotif] = useState<string>("");
	const	[access_token, setToken] = useState<string>("");
	const	router = useRouter();
	let		avatarChosen: avatarType = {
		image: "",
		variant: "circular",
		borderColor: "var(--accent-color)",
		text: "",
		empty: false,
	};

	avatarChosen.image = avatars[0] ? avatars[0] : "";
	if (avatarChosen.image === "")
		avatarChosen.text = texts[0];
	if (avatarChosen.image === "" && avatarChosen.text === "")
		avatarChosen.empty = true;

	const	selectAvatar = (avatar: avatarType) => {
		avatarChosen = avatar;
	}

	const	selectColor = (color: string) => {
		avatarChosen.borderColor = color;
	}

	useEffect(() => {

		const changeCookie = async () => {
			try {
				const	res = await fetch("http://localhost:3000/api/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						access_token,
					}),
				});

				const	data = await res.json();

				if (!res.ok || data.error)
					throw new Error();
				
				router.refresh();
			}
			catch (error) {
				console.log(error);
				setNotif("Something went wrong, please try again");
			}

		}

		if (access_token.length > 0) {
			changeCookie();
		}
	}, [access_token])
	
	const	handleActionLogin = async (data: FormData) => {
		const	loginUser = data.get('login') as string;
		const	loginChecked = checkLoginFormat(loginUser);
		setNotif(loginChecked);

		if (loginChecked.length > 0)
			return ;
		
		const	res: {
			exists: string,
			token: string,
		} = await handleActionServer(loginUser, avatarChosen, token);

		setNotif(res.exists);
		setToken(res.token);
	}

	return (
		<div className={styles.main}>
			<h3>You're almost there! 😁</h3>
			<form action={handleActionLogin}>
				<label>
					Please choose your login!
				</label>
				<p className={styles.little}>Don't worry, you can change it later.</p>
				<input type="text" name="login" placeholder="login"/>
				{notif.length > 0 && <div className={styles.notif}>{notif}</div>}
				<p className={styles.choose}>Make you pretty:</p>
				<div className={styles.avatars}>
					<ChooseAvatar selectColor={selectColor} selectAvatar={selectAvatar} texts={texts} avatars={avatars}/>
				</div>
				<button>Let's go!</button>
			</form>
		</div>
	);
}

