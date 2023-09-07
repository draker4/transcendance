"use client"

import Link from "next/link";
import styles from "@/styles/error/Error.module.css";
import HelpIcon from '@mui/icons-material/Help';

type Props = {
    ErrorTitle?: string;
    ErrorNotif?: string;
    ReturnLink?: string;
    ReturnLinkName?: string;
  };


export default function ErrorHandler({ ErrorTitle, ErrorNotif, ReturnLink, ReturnLinkName }:Props) {

  const title = ErrorTitle ? ErrorTitle : "Oops, something went wrong";
  const notif = ErrorNotif ? ErrorNotif : "Please try again later";
  const link = ReturnLink ? ReturnLink : "/home";
  const linkName = ReturnLinkName ? ReturnLinkName : "return to home page";

  return (
    <main className={styles.main}>
      <p className={styles.icon}><HelpIcon fontSize="inherit"/></p>
      <h1>{title}</h1>
      <p className={styles.error}>{notif}</p>
      <Link href={link} className={styles.link}>{linkName}</Link>
    </main>
  )
}
