"use client"

import React, { use } from "react";
import styles from "@/styles/game/game_infos.module.css"

import { useRouter } from "next/navigation";

import Image from "next/image";

export default function Matchmaking_Game_Infos({ game } : {game : any }) {

    const router = useRouter();

    const join_game = () => {

        //Check si la game à un mdp , si oui demande le mdp

        //Demande comment l'user veut rejoindre la game

        //Sinon join la game
        //Fais une demande au back
        //Si back ok -> join la game

        const url = 'game/' + game.uuid;
        router.push(url);
    }

    const watch_game = () => {

        //Check si la game à un mdp , si oui demande le mdp

        //Demande comment l'user veut rejoindre la game

        //Sinon join la game
        //Fais une demande au back
        //Si back ok -> join la game

        const url = 'game/' + game.uuid;
        router.push(url);
    }

    return (
        <div className={styles.game_infos}>
            <div className={styles.name_box}>
                <p>{game.Name}</p>
            </div>
            <div className={styles.avatar_host}>
                {/* <p>{game.Host}</p> */}
                <Image src={`/images/game/check.png`} alt="one_game" width="50" height="50"/>
            </div>
            <div className={styles.vs}>
                <Image src={`/images/game/vs.png`} alt="one_game" width="50" height="50"/>
            </div>
            <div className={styles.avatar_opponent}>
                <Image src={`/images/game/check.png`} alt="one_game" width="50" height="50"/>
                {/* <p>{game.Opponent}</p> */}
            </div>
            <div className={styles.status}>
                {game.Status == "Waiting" && <p>Waiting</p>}
                {game.Status == "In progress" && <p>In progress</p>}
            </div>
            <div className={styles.score}>
                <p>{game.Score_Host} / {game.Score_Opponent}</p>
            </div>
            <div className={styles.mdp_input}>
                {game.Password  && <input type="text" placeholder=" Mot de passe"/>}
                {!game.Password && <div></div>}
            </div>
            <div className={styles.button_join_box}>
                <button className={styles.button} onClick={join_game} > Rejoindre </button>
            </div>
            <div className={styles.button_watch_box}>
                <button className={styles.button} onClick={watch_game} > Regarder </button>
            </div>
        </div>
    );
}
