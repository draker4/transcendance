"use client";

import styles from "@/styles/profile/AvatarCard.module.css";
import AvatarUser from "../../avatarUser/AvatarUser";

type Props = {
  avatar: Avatar;
  isOwner: boolean;
  onClick: () => void;
  previewBorder: string;
  previewBackground: string;
};

export default function Avatar({
  avatar,
  isOwner,
  onClick,
  previewBorder,
  previewBackground,
}: Props) {
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
}
