"use client"

import React, { use } from "react";
import styles from "@/styles/game/infos_middle.module.css"
import Image from "next/image";

export default function Infos_Var({ text, num, img } : { text: string, num: number, img: string }) {
    return (
        <div className={styles.info_line}>
            <div className={styles.info_icone}>
                <Image src={`/images/${img}.png`} alt={text} width="100" height="100"/>
            </div>
            <p>{text}</p>
            <p>{num}</p>
        </div>);
}