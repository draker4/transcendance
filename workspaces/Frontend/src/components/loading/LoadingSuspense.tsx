"use client"

import { CircularProgress } from "@mui/material";
import styles from "@/styles/loading/Loading.module.css";

export default function LoadingSuspense() {
	return (
		<div className={styles.main}>
			<CircularProgress />
			<h2>Loading...</h2>
		</div>
	);
}
