"use client";

import React, { use } from "react";
import styles from "@/styles/game/ButtonImg.module.css";
import Image from "next/image";

export default function ButtonImg({
  text,
  onClick,
  img,
}: {
  text: string;
  onClick: any;
  img: string;
}) {
  return (
    <button className={styles.home_button} onClick={onClick}>
      <div className={styles.button_icone}>
        <Image src={`/images/${img}.png`} alt={text} width="100" height="100" />
      </div>
      <p>{text}</p>
    </button>
  );
}
