"use client"

import React, { use } from "react";
import styles from "@/styles/game/game_infos.module.css"

export default function Matchmaking_Game_Infos({ json }: { json: string }) {
    return (
        <div className={styles.game_infos}>
            <p>One game</p>
        </div>
    );
}