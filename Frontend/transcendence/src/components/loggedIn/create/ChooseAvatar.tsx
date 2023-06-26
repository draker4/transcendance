"use client";

import Avatar from "@mui/material/Avatar";
import styles from "@/styles/loggedIn/create/ChooseAvatar.module.css";
import { useState } from "react";
import ChooseColor from "./ChooseColor";
import avatarType from "@/types/Avatar.type";

export default function ChooseAvatar({
  selectBorder,
  selectBackground,
  selectAvatar,
  text,
  avatars,
}: {
  selectBorder: (color: string) => void;
  selectBackground: (color: string) => void;
  selectAvatar: (avatar: avatarType) => void;
  text: string;
  avatars: string[];
}) {
  const [colorBorder, setColorBorder] = useState("#22d3ee");
  const [backgroundColor, setBackgroundColor] = useState("#22d3ee");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("empty");

  const handleBorder = (color: string) => {
    setColorBorder(color);
    selectBorder(color);
  };

  const handleBackground = (color: string) => {
    setBackgroundColor(color);
    selectBackground(color);
  };

  const handleSelectAvatar = (key: string, avatar: avatarType) => {
    setSelectedAvatar(key);
    selectAvatar(avatar);
  };

  return (
    <div>
      <div className={styles.main}>
        <Avatar
          className={`${styles.avatar} ${
            "empty" === selectedAvatar ? styles.selected : ""
          }`}
          variant="circular"
          onClick={() =>
            handleSelectAvatar("empty", {
              image: "",
              login: "",
              variant: "circular",
              borderColor: colorBorder,
              backgroundColor: backgroundColor,
              text: text,
              empty: true,
            })
          }
          sx={{
            width: 80,
            height: 80,
            border: `4px solid ${colorBorder}`,
            backgroundColor: `${backgroundColor}`,
          }}
        />
        {avatars.map((avatar) => {
          return (
            <Avatar
              className={`${styles.avatar} ${
                avatar === selectedAvatar ? styles.selected : ""
              }`}
              key={avatar}
              src={avatar}
              alt={text}
              variant="circular"
              onClick={() =>
                handleSelectAvatar(avatar, {
                  image: avatar,
                  login: "",
                  variant: "circular",
                  borderColor: colorBorder,
                  backgroundColor: backgroundColor,
                  text: text,
                  empty: false,
                })
              }
              sx={{
                width: 80,
                height: 80,
                border: `4px solid ${colorBorder}`,
                backgroundColor: `${backgroundColor}`,
              }}
            />
          );
        })}
        <Avatar
          className={`${styles.avatar} ${
            text === selectedAvatar ? styles.selected : ""
          }`}
          key={text}
          variant="circular"
          imgProps={{
            referrerPolicy: "no-referrer",
          }}
          onClick={() =>
            handleSelectAvatar(text, {
              image: "",
              login: "",
              variant: "circular",
              borderColor: colorBorder,
              backgroundColor: backgroundColor,
              text: text,
              empty: false,
            })
          }
          sx={{
            width: 80,
            height: 80,
            border: `4px solid ${colorBorder}`,
            backgroundColor: `${backgroundColor}`,
          }}
        >
          {text}
        </Avatar>
      </div>

      <div className={styles.chooseColor}>
        <ChooseColor onSelect={handleBorder} />
        <ChooseColor onSelect={handleBackground} />
      </div>
    </div>
  );
}
