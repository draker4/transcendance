"use client";

import styles from "@/styles/profile/AvatarCard.module.css";
import AvatarUser from "../../avatarUser/AvatarUser";

type Props = {
  avatar: Avatar;
  isOwner: boolean;
  onClick: () => void;
  displaySettings: boolean;
  previewBorder: string;
  previewBackground: string;
};

export default function Avatar({
  avatar,
  isOwner,
  onClick,
  displaySettings,
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
        {!displaySettings && (
          <AvatarUser
            avatar={avatar}
            borderSize="clamp(0.2rem, 0.1rem + 0.7vw, 0.8rem)"
            backgroundColor={avatar.backgroundColor}
            borderColor={avatar.borderColor}
          />
        )}
        {displaySettings && (
          <AvatarUser
            avatar={avatar}
            borderSize="clamp(0.2rem, 0.1rem + 0.7vw, 0.8rem)"
            backgroundColor={previewBackground}
            borderColor={previewBorder}
          />
        )}
      </div>
    </div>
  );
}
