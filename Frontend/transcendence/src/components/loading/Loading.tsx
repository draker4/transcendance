"use client"

import { CircularProgress } from "@mui/material";
import styles from "@/styles/loading/Loading.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoadingComponent() {

	const	router = useRouter();

	useEffect(() => {
		router.push("/home");
	})

	return (
		<div className={styles.main}>
			<CircularProgress />
			<h2>Loading...</h2>
		</div>
	);
}
