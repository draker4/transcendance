"use client"

import React, { use } from "react";

import styles from "@/styles/lobby/Game_Card.module.css"

type Props = {
    token: string | undefined;
    game_id: string | undefined;
}

export default function Game_Card({ token, game_id }: Props) {

    return (

        <div className={styles.main}>
            <p>Game Card</p>
            <p>{game_id}</p>
        </div>
        
    );
}