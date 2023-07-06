import AvatarUser from "@/components/loggedIn/avatarUser/AvatarUser";
import styles from "@/styles/chatPage/privateMsg/ChatPrivateMsg.module.css";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  pongie: Pongie;
};

export default function Header({ icon, pongie }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.icon}>{icon}</div>
      <Link href={"/home/profile/" + pongie.login} className={styles.card}>
        <div className={styles.avatar}>
          <AvatarUser
            avatar={pongie.avatar}
            borderSize="3px"
            borderColor={pongie.avatar.borderColor}
            backgroundColor={pongie.avatar.backgroundColor}
          />
        </div>
        <div style={{ color: pongie.avatar.borderColor }}> {pongie.login} </div>
      </Link>
    </div>
  );
}
