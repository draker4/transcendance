"use client";

import styles from "@/styles/profile/AvatarCard.module.css";
import AvatarUser from "../../avatarUser/AvatarUser";
import { Badge } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { Dispatch, SetStateAction, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import { faCheck, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

type Props = {
  avatar: Avatar;
  isOwner: boolean;
  onClick: () => void;
  previewBorder: string;
  previewBackground: string;
  displaySettings: boolean;
  uploadButton: boolean;
  setuploadButton?: Dispatch<SetStateAction<boolean>>;
};

const badgeStylePhoto = {
	"& .MuiBadge-badge": {
	  color: 'var(--tertiary1)',
	  backgroundColor: 'var(--primary1)',
	  border: "2px solid var(--accent1)",
    width: "20%",
    height: "20%",
	},
	"& .MuiBadge-badge:hover": {
    width: "23%",
    height: "23%",
    border: "2px solid var(--accent3)",
	},
}

const badgeStyleRight = {
	"& .MuiBadge-badge": {
	  color: 'var(--tertiary1)',
	  backgroundColor: 'var(--primary1)',
	  border: "2px solid var(--accent1)",
	  cursor: "pointer",
    width: "20%",
    height: "20%",
	},
	"& .MuiBadge-badge:hover": {
    width: "23%",
    height: "23%",
    border: "2px solid var(--accent3)",
	},
}

const badgeStyleLeft = {
	"& .MuiBadge-badge": {
		color: 'var(--tertiary1)',
		backgroundColor: 'var(--primary1)',
		border: "2px solid var(--accent1)",
		cursor: "pointer",
		width: "6px",
	}
}

export default function AvatarProfile({
  avatar,
  isOwner,
  onClick,
  previewBorder,
  previewBackground,
  displaySettings,
  uploadButton,
  setuploadButton,
}: Props) {

  const	avatarRef = useRef<HTMLDivElement | null>(null);

  if (!displaySettings)
    return (
      <div className={styles.avatar}>
        <div
          className={`${styles[avatar.variant]} 
          ${!isOwner ? styles.disabled : ""}`}
          onClick={onClick}
          style={{ backgroundColor: previewBorder }}
        >
            <AvatarUser
              avatar={avatar}
              borderSize="6px"
              backgroundColor={previewBackground}
              borderColor={previewBorder}
              fontSize="3rem"
            />
        </div>
      </div>
    );

  else
  return (
    <div className={styles.avatar}>
      <div
        className={`${styles[avatar.variant]} 
        ${!isOwner || uploadButton ? styles.disabled : ""}`}
        style={{ backgroundColor: previewBorder }}
      >
        {
          !uploadButton && avatar.variant === "circular" &&
            <Badge badgeContent={
              <FontAwesomeIcon
                icon={faImage}
                className={styles.iconPhoto}
              />} sx={badgeStylePhoto}
              overlap="circular"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              className={styles.avatarUser}
              onClick={(event) => {
                if (avatarRef.current && avatarRef.current.contains(event.target as Node)) {
                  return ;
                }
                if (setuploadButton)
                  setuploadButton(true);
              }}
            >
              <div
                ref={avatarRef}
                onClick={onClick}
                className={styles.avatarUser}
              >
                <AvatarUser
                  avatar={avatar}
                  borderSize="6px"
                  backgroundColor={previewBackground}
                  borderColor={previewBorder}
                  fontSize="3rem"
                />
              </div>
            </Badge>
        }
        {
          avatar.variant === "rounded" &&
          <AvatarUser
            avatar={avatar}
            borderSize="6px"
            backgroundColor={previewBackground}
            borderColor={previewBorder}
            fontSize="3rem"
          />
        }
        {
          uploadButton &&
          <Badge badgeContent={
            <FontAwesomeIcon
              icon={faCheck}
            />} sx={badgeStyleRight}
            overlap="circular"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            onClick={(event) => {
              if (avatarRef.current && avatarRef.current.contains(event.target as Node)) {
                return ;
              }
              // handleSubmit(handleOnSubmit)()
            }}
            className={styles.avatarUser}
          >
            <Badge badgeContent={
              <FontAwesomeIcon
                icon={faXmark}
              />} sx={badgeStyleLeft}
              overlap="circular"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              className={styles.avatarUser}
              // onClick={deleteImage}
            >
            <div
              ref={avatarRef}
              onClick={onClick}
              className={styles.avatarUser}
            >
              <Avatar
                src={avatar.image}
                variant="circular"
                sizes="cover"
                sx={{
                  width: "100%",
                  height: "100%",
                  borderWidth: "6px",
                  borderStyle: "solid",
                  borderColor: previewBorder,
                  backgroundColor: previewBackground,
                  borderRadius: `${avatar.variant === "rounded" ? "15%" : "50%"}`,
                  fontSize: "3rem",
                }}
              >
                {avatar.text}
              </Avatar>
            </div>
          </Badge>
        </Badge>
        }
      </div>
    </div>
  );
}
