import { setCookie } from "cookies-next";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "@/styles/welcome/login/Login.module.css";
import LogEmail from "./LogEmail";
import LogService from "./LogService";

export default function LogInComponent() {
  const test = useParams().notif;
  const router = useRouter();
  const [textButton, setTextButton] = useState<string>("Continue");
  const [register, setRegister] = useState<boolean>(false);
  const [login, setLogin] = useState<string>("");
  const [notif, setNotif] = useState<string>("");

  // ----------------------------------  CHARGEMENT  ---------------------------------- //

  useEffect(() => {
    if (login.length > 0) {
      const tokens = login.split(" ");

      if (tokens.length === 2) {
        setCookie("crunchy-token", tokens[0], {
          httpOnly: true,
          sameSite: true,
          path: "/",
        });
        setCookie("refresh-token", tokens[1], {
          httpOnly: true,
          sameSite: true,
          path: "/",
        });
        router.push("/home");
      }
      else
        setNotif("Something went wrong, please try again!");
    }

    if (register) router.push("/welcome/confirm");

    if (test === "wrong")
      setNotif("Something went wrong, please try again!");
  }, [register, login, router, test]);

  // -------------------------------------  RENDU  ------------------------------------ //
  return (
    <div className={styles.logIn}>
      <h1 className={styles.title}>Connection / Inscription</h1>
      <LogEmail
        notif={notif}
        setNotif={setNotif}
        textButton={textButton}
        setTextButton={setTextButton}
        register={register}
        setRegister={setRegister}
        login={login}
        setLogin={setLogin}
      />
      <div className={styles.separator}>
        <span>Or</span>
      </div>
      <LogService setTextButton={setTextButton} />
    </div>
  );
}
