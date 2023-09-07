"use client"

import Link from "next/link";
import styles from "@/styles/error/ErrorsMerged.module.css";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    errorTitle?: string;
    errorNotif?: string;
    returnLink?: string;
    returnLinkName?: string;
  };


export default function ErrorHandler({ errorTitle, errorNotif, returnLink, returnLinkName }:Props) {

  const title = errorTitle ? errorTitle : "Oops, something went wrong";
  const notif = errorNotif && process.env && process.env.ENVIRONNEMENT && process.env.ENVIRONNEMENT === "dev" ? errorNotif : "Please try again later";
  const link = returnLink ? returnLink : "/home";
  const linkName = returnLinkName ? returnLinkName : "return to home page";

  return (
    <main className={styles.errorPage}>
      <div className={styles.errorFrame}>
        <div className={styles.error}>
          <FontAwesomeIcon icon={faQuestionCircle} className={styles.icon} />
          <h2 className={styles.errorTitle}>{title}</h2>
          <p className={styles.errorNotif}>{notif}</p>
          <Link href={link} className={styles.errorLink}>
            <h3 className={styles.errorReturn}>{linkName}</h3>
          </Link>
        </div>
      </div>
    </main>
  )
}