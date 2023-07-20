import Image from "next/image";
import styles from "@/styles/welcome/login/LogService.module.css";

type Props = {
  setTextButton: Function;
};

export default function LogInComponent({ setTextButton }: Props) {
  const width = 40;
  const height = 40;
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
        <Image
          alt="42 school logo"
          src="/images/auth/42_Logo.png"
          width={width}
          height={height}
          onClick={open42}
          className={styles.school}
        />
        <Image
          alt="google logo"
          src="/images/auth/google.png"
          width={width}
          height={height}
          onClick={openGoogle}
          className={styles.google}
        />
      </div>
    </div>
  );
}
