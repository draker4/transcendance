"use client"

import Link from "next/link";
import styles from "@/styles/error/ErrorsMerged.module.css";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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