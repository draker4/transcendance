"use client";

import {
  loginPassword,
  registerFormEmail,
  registerFormPassword,
} from "@/lib/auth/registerForm";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import styles from "@/styles/welcome/login/LogEmail.module.css";

type FormInputs = {
  [key: string]: string;
};

type Props = {
  notif: string;
  setNotif: Function;
  textButton: string;
  setTextButton: Function;
  register: boolean;
  setRegister: Function;
  login: string;
  setLogin: Function;
};

export default function LogEmail({
  notif,
  setNotif,
  textButton,
  setTextButton,
  register,
  setRegister,
  login,
  setLogin,
}: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<boolean>(false);
  const [passwordSecured, setPasswordSecured] = useState<string>("");
  const [changeEmail, setChangeEmail] = useState<boolean>(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { handleSubmit, setValue } = useForm<FormInputs>();
  let exists = useRef<boolean>(false);

  const handleCaptcha = async () => {
    if (!executeRecaptcha) {
      throw new Error("Captcha not ready");
    }

    const token = await executeRecaptcha("enquiryFormSubmit");

    const response = await fetch(
      `http://${process.env.HOST_IP}:3000/api/auth/captcha`,
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gRecaptchaToken: token,
        }),
      }
    );

    const notifCaptcha = await response.json();

    if (notifCaptcha?.status !== "ok") throw new Error();
  };

  const iconEmail = () => {
    setEmail("");
    setNotif("");
    setPasswordSecured("");
    setTextButton("Continue");
    setPassword(false);
    exists.current = false;
    return;
  };

  const submit = async (data: FormInputs) => {
    try {
      // await handleCaptcha();

      //if email only, first step of authentification
      const emailUser = data.email;
      if (email.length === 0) {
        setEmail(emailUser);

        const res: {
          emailExists: boolean;
          notif: boolean;
        } = await registerFormEmail(emailUser);

        if (res.notif) throw new Error();

        setPassword(true);
        setChangeEmail(true);

        if (res.emailExists) exists.current = true;

        return;
      }

      const passwordUser = data.password;
      let res: {
        passwordSecured: string;
        register: boolean;
        login: string;
      } = { passwordSecured: "", register: false, login: "" };

      if (!exists.current)
        res = await registerFormPassword(passwordUser, email);
      else res = await loginPassword(passwordUser, email);

      setPasswordSecured(res.passwordSecured);

      if (register || login) setTextButton("Loading...");
      setRegister(res.register);
      setLogin(res.login);
    } catch (error) {
      setNotif("Something went wrong, please try again!");
    }
  };

  // -------------------------------------  RENDU  ------------------------------------ //
  return (
    <form onSubmit={handleSubmit(submit)} className={styles.logEmail}>
      <p className={styles.description}>
        Enter your email to log in or register your account
      </p>
      {email.length === 0 && (
        <input
          type="email"
          autoComplete="Email"
          placeholder="Email"
          name="email"
          className={styles.input}
          required
          onChange={(event) =>
            setValue("email", (event.target as HTMLInputElement).value)
          }
        />
      )}
      {email.length > 0 && (
        <div className={styles.email}>
          {email}
          {changeEmail && (
            <div className={styles.emailBtn} onClick={iconEmail}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </div>
          )}
        </div>
      )}

      <div className={password ? styles.openPassword : styles.closePassword}>
        <input
          type="password"
          autoComplete="Password"
          placeholder="Password"
          name="password"
          className={styles.input}
          required={password}
          onChange={(event) =>
            setValue("password", (event.target as HTMLInputElement).value)
          }
        />
        {passwordSecured.length > 0 && (
          <div className={styles.notif}>{passwordSecured}</div>
        )}
      </div>

      {notif.length > 0 && <div className={styles.notif}>{notif}</div>}

      <button
        type="submit"
        disabled={textButton === "Loading..."}
        className={styles.continueBtn}
      >
        {textButton}
      </button>
    </form>
  );
}
