"use client";

import { useRouter } from "next/navigation";
import styles from "@/styles/error/ErrorsMerged.module.css";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  errorTitle?: string;
  errorNotif?: string;
  returnLink?: string;
  returnLinkName?: string;
};

export default function ErrorHandler({
  errorTitle,
  errorNotif,
  returnLink,
  returnLinkName,
}: Props) {
  const router = useRouter();
  const title = errorTitle ? errorTitle : "Oops, something went wrong";
  const notif =
    errorNotif &&
    process.env &&
    process.env.ENVIRONNEMENT &&
    process.env.ENVIRONNEMENT === "dev"
      ? errorNotif
      : "Please try again later";
  const linkName = returnLinkName ? returnLinkName : "return to home page";

  const returnHome = () => {
    router.push("/home?home");
  };

  return (
    <main className={styles.errorPage}>
      <div className={styles.errorFrame}>
        <div className={styles.error}>
          <FontAwesomeIcon icon={faQuestionCircle} className={styles.icon} />
          <h2 className={styles.errorTitle}>{title}</h2>
          <p className={styles.errorNotif}>{notif}</p>
          <div className={styles.errorLink} onClick={returnHome}>
            <h3 className={styles.errorReturn}>{linkName}</h3>
          </div>
        </div>
      </div>
    </main>
  );
}
