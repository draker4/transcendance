"use client";

import styles from "@/styles/error/ServerError.module.css";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function ServerError() {
  return (
    <div className={styles.serverErrorPage}>
      <div className={styles.serverErrorFrame}>
        <div className={styles.serverError}>
          <FontAwesomeIcon icon={faQuestionCircle} className={styles.icon} />
          <h2 className={styles.errorTitle}>Sorry, an error has occured...</h2>
          <Link href="/welcome/disconnect" className={styles.errorLink}>
            <h3 className={styles.errorBackHome}>Return to login page</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}
