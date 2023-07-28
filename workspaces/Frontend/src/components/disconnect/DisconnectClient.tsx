"use client"
import styles from "@/styles/disconnect/Disconnect.module.css";
import { useEffect, useState } from "react";

export default function DisconnectClient() {

	const	[draw, setDraw] = useState<boolean>(true);

	setTimeout(() => {
		setDraw(false);
	}, 5000);

	const	signoff = async () => {
		try {
			await fetch(`http://${process.env.HOST_IP}:3000/api/signoff`);
		}
		catch(error) {
			console.log(error);
		}
	}

	useEffect(() => {

		const	handleClick = () => {
			setDraw(false);
		}

		window.addEventListener('click', handleClick);

		return () => {
			window.removeEventListener('click', handleClick);
		}
	})

	signoff();

	if (draw)
		return (
			<div className={styles.main}>
				<h4>Oh no! You just have been disconnected!❤️ Please sign in again!👍🚀</h4>
			</div>
		)

	return <></>;
}
