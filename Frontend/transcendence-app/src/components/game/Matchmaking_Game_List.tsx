"use client"

import React, { use } from "react";
import One_Game from "@/components/game/Matchmaking_Game_Infos"
import styles from "@/styles/game/game_list.module.css"

export default function Matchmaking_Game_List({ json }: { json: string }) {

    const jsonData = JSON.parse(json);
  
    return (
      <div className={styles.game_list}>
        {jsonData.map((row : any, index : any) => (
            <One_Game json={json}/>
        ))}
      </div>
    );
  }
