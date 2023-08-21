"use client";

import Avatar from "@mui/material/Avatar";
import styles from "@/styles/createLogin/ChooseAvatar.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import ChooseColor from "./ChooseColor";
import { PongColors } from "@/lib/enums/PongColors.enum";
import UploadButton from "../uploadImage/UploadButton";

export default function ChooseAvatar({
  selectBorder,
  selectBackground,
  selectAvatar,
  text,
  avatars,
  fontSize,
  textButton,
  textButtonInitial,
}: {
  selectBorder: (color: string) => void;
  selectBackground: (color: string) => void;
  selectAvatar: (avatar: Avatar) => void;
  text: string;
  avatars: string[];
  fontSize: string;
  textButton: string;
  textButtonInitial: string;
}) {
  const [colorBorder, setColorBorder] = useState<string>(PongColors.appleGreen);
  const [backgroundColor, setBackgroundColor] = useState<string>(PongColors.appleGreen);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("empty");
  const [avatarsAdded, setAvatarsAdded] = useState<string[]>([]);

  const handleBorder = (color: string) => {
    setColorBorder(color);
    selectBorder(color);
  };

  const handleBackground = (color: string) => {
    setBackgroundColor(color);
    selectBackground(color);
  };

  const handleSelectAvatar = (key: string, avatar: Avatar) => {
    if (textButton === textButtonInitial) {
      setSelectedAvatar(key);
      selectAvatar(avatar);
    }
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
              variant: "circular",
              borderColor: colorBorder,
              backgroundColor: backgroundColor,
              text: text,
              empty: true,
              isChannel: false,
              decrypt: false,
            })
          }
          sx={{
            width: 80,
            height: 80,
            border: `4px solid ${colorBorder}`,
            backgroundColor: `${backgroundColor}`,
          }}
        />

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
              variant: "circular",
              borderColor: colorBorder,
              backgroundColor: backgroundColor,
              text: text.toUpperCase().slice(0, 3),
              empty: false,
              isChannel: false,
              decrypt: true,
            })
          }
          sx={{
            width: 80,
            height: 80,
            border: `4px solid ${colorBorder}`,
            backgroundColor: `${backgroundColor}`,
            fontSize: fontSize,
          }}
        >
          {text.toUpperCase().slice(0, 3)}
        </Avatar>

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
                  variant: "circular",
                  borderColor: colorBorder,
                  backgroundColor: backgroundColor,
                  text: text,
                  empty: false,
                  isChannel: false,
                  decrypt: false,
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

        {avatarsAdded.map((avatar) => {
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
                  variant: "circular",
                  borderColor: colorBorder,
                  backgroundColor: backgroundColor,
                  text: text,
                  empty: false,
                  isChannel: false,
                  decrypt: true,
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

        <div className={styles.avatar}>
          <UploadButton
            setAvatar={setAvatarsAdded}
            borderColor={colorBorder}
            backgroundColor={backgroundColor}
          />
        </div>

      </div>

      <div className={styles.chooseColor}>
        <ChooseColor
          onSelect={handleBorder}
          textButton={textButton}
          textButtonInitial={textButtonInitial}
        />
        <ChooseColor
          onSelect={handleBackground}
          textButton={textButton}
          textButtonInitial={textButtonInitial}
        />
      </div>
    </div>
  );
}
