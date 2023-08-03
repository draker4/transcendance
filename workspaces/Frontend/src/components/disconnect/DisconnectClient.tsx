"use client"

import disconnect from "@/lib/disconnect/disconnect";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function DisconnectClient() {

	const	signoff = async () => {
		await disconnect();
	}

	useEffect(() => {
		toast.info("You have been disconnected...");
	}, []);

	signoff();

	return <></>;
}
