"use client";

import styles from "@/styles/error/ErrorsMerged.module.css";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function ServerError() {
  return (
    <div className={styles.errorPage}>
      <div className={styles.errorFrame}>
        <div className={styles.error}>
          <FontAwesomeIcon icon={faQuestionCircle} className={styles.icon} />
          <h2 className={styles.errorTitle}>Sorry, an error has occured...</h2>
          <Link href="/welcome/disconnect" className={styles.errorLink}>
            <h3 className={styles.errorReturn}>Return to login page</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}
