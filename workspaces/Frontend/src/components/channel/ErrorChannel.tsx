"use client"

import Link from "next/link";
import styles from "@/styles/profile/Profile.module.css";
import HelpIcon from '@mui/icons-material/Help';

type Params = {
	params: {
	  id: number;
	};
  };

export default function ErrorChannel({ params: {id}}:Params) {

	const errorMsg:string = `Sorry the channel of id :${id} is private or doesn't exist`;
  return (
	<main className={styles.main}>
			<p className={styles.icon}><HelpIcon fontSize="inherit"/></p>
			<h1>Unavailable Channel Page</h1>
			<p className={styles.error}>{errorMsg}</p>
			<Link href={"/home"} className={styles.link}>return to home page</Link>
	</main>
  );
}
