"use client";

import styles from "@/styles/profile/AvatarCard.module.css";

type Props = {
  name: string;
  isOwner: boolean;
};

export default function ProfileLogin({ name, isOwner }: Props) {
  // [!] clean le Edit button et simplifier les props si au final il est retire

  const slices = [];
  for (let i = 0; i < name.length; i += 20) {
    slices.push(name.slice(i, i + 20));
  }

  const fontsize = name.length > 12 ? "small" : "medium";


  
  return (
    <div className={styles.loginCard}>
      <div className={styles.login}>
      {slices.map((slice, index) => (
          <h1 key={index} className={styles[fontsize]}>{slice}</h1>
        ))}
      </div>
      {/* {isOwner && <EditButton />} */}
    </div>
  );
}
