"use client"

import Link from "next/link";
import styles from "@/styles/profile/Profile.module.css";
import HelpIcon from '@mui/icons-material/Help';

type Params = {
	params: {
	  login: string;
	};
  };

export default function ErrorProfile({ params: {login}}:Params) {

const errorMsg:string = `Sorry the user ${login} is not a Ponger`;


	return (
	<main className={styles.main}>
			<p className={styles.icon}><HelpIcon fontSize="inherit"/></p>
			<h1>Unavailable Profile Page</h1>
			<p className={styles.error}>{errorMsg}</p>
			<Link href={"/home"} className={styles.link}>return to home page</Link>
	</main>
  );
}