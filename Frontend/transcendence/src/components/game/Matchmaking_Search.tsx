"use client"

import React, { use } from "react";
import styles from "@/styles/game/search.module.css"

export default function Matchmaking_Search({onChangeFct}: {onChangeFct: any}) {

    const handleInputChange = (event : any) => {
        const searchTerm = event.target.value;
        onChangeFct(searchTerm);
    };

    return (
        <input  className={styles.search_input} type="text" onChange={handleInputChange} placeholder="Rechercher" />
    );
}