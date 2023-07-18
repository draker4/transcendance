"use client";

import { checkLoginFormat } from "@/lib/create/checkLogin";
import ChooseAvatar from "./ChooseAvatar";
import styles from "@/styles/createLogin/FormLogin.module.css";
import { useEffect, useRef, useState } from "react";
import { handleActionServer } from "@/lib/create/handleActionServer";
import { useRouter } from "next/navigation";

export default function FormLogin({
  avatars,
  token,
}: {
  avatars: string[];
  token: string;
}) {
  const [notif, setNotif] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [access_token, setAccessToken] = useState<string>("");
  const [refresh_token, setRefreshToken] = useState<string>("");
  const router = useRouter();
  const avatarChosenRef = useRef<Avatar>({
    image: "",
    variant: "circular",
    borderColor: "#22d3ee",
    backgroundColor: "#22d3ee",
    text: "",
    empty: true,
    name: "",
    isChannel: false,
    decrypt: false,
  });

  const selectAvatar = (avatar: Avatar) => {
    avatar.name = avatarChosenRef.current.name;
    avatarChosenRef.current = avatar;
  };

  const borderColor = (color: string) => {
    avatarChosenRef.current.borderColor = color;
  };

  const backgroundColor = (color: string) => {
    avatarChosenRef.current.backgroundColor = color;
  };

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

    avatarChosenRef.current.text = text.toUpperCase().slice(0, 2);
    avatarChosenRef.current.name = text;
    setText(text.toUpperCase().slice(0, 2));
  };

  useEffect(() => {
    const changeCookie = async () => {
      try {
        const res = await fetch(
          `http://${process.env.HOST_IP}:3000/api/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_token,
              refresh_token,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok || data.error) throw new Error();

        router.refresh();
      } catch (error) {
        console.log(error);
        setNotif("Something went wrong, please try again");
      }
    };

    if (access_token.length > 0) {
      changeCookie();
    }
  }, [access_token, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const loginUser = e.target.login.value;
    const loginChecked = checkLoginFormat(loginUser);
    setNotif(loginChecked);

    if (loginChecked.length > 0) return;

    const res: {
      exists: string;
      access_token: string;
      refresh_token: string;
    } = await handleActionServer(loginUser, avatarChosenRef.current, token);

    setNotif(res.exists);
    setAccessToken(res.access_token);
    setRefreshToken(res.refresh_token);
  };

  return (
    <div className={styles.formLogin}>
      <h1 className={styles.title}>You are almost there! 😁</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.description}>Please choose your login!</label>
        <p className={styles.little}>
          Don&apos;t worry, you can change it later.
        </p>

        <input
          type="text"
          name="login"
          placeholder="login"
          maxLength={10}
          onChange={handleText}
          className={styles.login}
        />

        {notif.length > 0 && <div className={styles.notif}>{notif}</div>}
        <p className={styles.choose}>Make you pretty:</p>

        <div className={styles.avatars}>
          <ChooseAvatar
            selectBorder={borderColor}
            selectBackground={backgroundColor}
            selectAvatar={selectAvatar}
            text={text}
            avatars={avatars}
          />
        </div>

        <button title="Create avatar" className={styles.confirmBtn}>
          Let&apos;s go!
        </button>
      </form>
    </div>
  );
}
