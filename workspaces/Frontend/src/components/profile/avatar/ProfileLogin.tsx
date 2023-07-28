"use client";

import styles from "@/styles/profile/AvatarCard.module.css";

type Props = {
  name: string;
  isOwner: boolean;
};

export default function ProfileLogin({ name, isOwner }: Props) {
  // [!] clean le Edit button et simplifier les props si au final il est retire

  return (
    <div className={styles.loginCard}>
      <div className={styles.login}>
        <h1>{name}</h1>
      </div>
      {/* {isOwner && <EditButton />} */}
    </div>
  );
}
