"use client"

import Link from "next/link";
import styles from "@/styles/profile/Profile.module.css";
import HelpIcon from '@mui/icons-material/Help';

type Params = {
	params: {
	  id: number;
	};
  };

export default function ErrorProfile({ params: {id}}:Params) {

// const errorMsg:string = `Sorry the user of id :${id} is not a Ponger`;

	return (
		<main className={styles.main}>
				<p className={styles.icon}><HelpIcon fontSize="inherit"/></p>
				<h1>Oops, we could not find this profile...</h1>
				<h4>Try again later!</h4>
				{/* <p className={styles.error}>{errorMsg}</p> */}
				<Link href={"/home"} className={styles.link}>return to home page</Link>
		</main>
  );
}
