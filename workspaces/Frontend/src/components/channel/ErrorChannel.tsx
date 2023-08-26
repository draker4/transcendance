"use client"

import Link from "next/link";
import styles from "@/styles/profile/Profile.module.css";
import HelpIcon from '@mui/icons-material/Help';

type Props = {
  id: number;
  caughtErrorMsg?: string;
  };

export default function ErrorChannel({id, caughtErrorMsg}:Props) {

	const errorMsg:string = caughtErrorMsg ? caughtErrorMsg : `Sorry the channel of id : ${id} doesn't exist`;
  return (
	<main className={styles.main}>
			<p className={styles.icon}><HelpIcon fontSize="inherit"/></p>
			<h1>Unavailable Channel Page</h1>
			<p className={styles.error}>{errorMsg}</p>
			<Link href={"/home"} className={styles.link}>return to home page</Link>
	</main>
  );
}
