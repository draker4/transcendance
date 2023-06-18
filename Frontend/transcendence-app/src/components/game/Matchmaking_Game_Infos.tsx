"use client"

import React, { use } from "react";
import styles from "@/styles/game/game_infos.module.css"

import { useRouter } from "next/navigation";

export default function Matchmaking_Game_Infos({ game } : {game : any }) {

    const router = useRouter();

    const join_game = () => {

        //Check si la game à un mdp , si oui demande le mdp

        //Demande comment l'user veut rejoindre la game

        //Sinon join la game
        //Fais une demande au back
        //Si back ok -> join la game

        const url = 'home/game/' + game.uuid;
        router.push(url);
    }


    return (
        <div className={styles.game_infos} onClick={join_game}>
            <ul className={styles.infos_list}>
                <li className={styles.info}>Name: {game.Name}</li>
                <li className={styles.info}>Hôte: {game.Host}</li>
                <li className={styles.info}>Adversaire: {game.Opponent}</li>
                <li className={styles.info}>Nombre de spectateurs: {game.Viewers_List}</li>
                <li className={styles.info}>Statut: {game.Status}</li>
                <li className={styles.info}>Creer à : {game.CreatedAt}</li>
            </ul>
        </div>
    );
}
