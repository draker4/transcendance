import Image from "next/image";
import styles from "@/styles/welcome/login/LogService.module.css";

type Props = {
  setTextButton: Function;
};

export default function LogInComponent({ setTextButton }: Props) {

  // -------------------------------------  FONCTIONS  ------------------------------------ //
  const open42 = () => {
    setTextButton("Loading...");
    window.open(process.env.URL_42, "_self");
  };

  const openGoogle = async () => {
    setTextButton("Loading...");
    window.open(`http://${process.env.HOST_IP}:4000/api/auth/google`, "_self");
  };

  // -------------------------------------  RENDU  ------------------------------------ //
  return (
    <div className={styles.logService}>
      <p className={styles.description}>Connect or register in one click</p>
      <div className={styles.logImg}>
        <div className={styles.oneClick} style={{paddingRight: "4px"}}>
          <Image
            alt="42 school logo"
            src="/images/auth/42_Logo.png"
            onClick={open42}
            fill
            style={{
              objectFit: "cover",
            }}
            className={styles.school}
          />
        </div>
        <div className={styles.oneClick}>
          <Image
            alt="google logo"
            src="/images/auth/google.png"
            fill
            style={{
              objectFit: "cover",
            }}
            onClick={openGoogle}
            className={styles.google}
          />
        </div>
      </div>
    </div>
  );
}
