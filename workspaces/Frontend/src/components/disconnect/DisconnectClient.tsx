"use client"
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function DisconnectClient() {

	const	signoff = async () => {
		try {
			await fetch(`http://${process.env.HOST_IP}:3000/api/signoff`);
		}
		catch(error) {
			console.log(error);
		}
	}

	useEffect(() => {
		toast.info("You have been disconnected...");
	}, []);

	signoff();

	return <></>;
}
