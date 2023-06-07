"use client"

import { useEffect } from 'react'

import Matchmaking_Button from '@/components/game/Matchmaking_Button'
import Matchmaking_Search from '@/components/game/Matchmaking_Search'
import Matchmaking_Game_List from '@/components/game/Matchmaking_Game_List'

import styles from '@/styles/game/game.module.css'

import GameService from '@/services/Game.service'

export default function Game() {

    //Variable qui contient true si le joueur est deja dans une partie
	const InGame = false;
    
    //Variable qui stock la derniere recherche
    let LastSearch = "";

    //Variable qui stock le json du dernier fetch
    const JsonGame = null;

    //Toutes les 5 sec on va chercher les parties en cours
    useEffect(() => {
        const interval = setInterval(() => {
            //Get la liste des game en cours
            //Update la recherche
            console.log("Refresh game liste");
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Defini une fonction qui sera appelee par le composant Matchmaking_Search et affiche dans la console le terme recherche
    const Update_Game_List = (searchTerm : string) => {
        LastSearch = searchTerm;
        console.log("Search term : " + LastSearch);
    };

	return (
        <main className={styles.main}>

            {/* Barre de recherche */}
            { !InGame && <Matchmaking_Search onChangeFct={Update_Game_List}/>}

            {/* Liste des game en lobby */}
            { !InGame && JsonGame && <Matchmaking_Game_List json={JsonGame} />}
            { !InGame && !JsonGame && <div className={styles.loading}>Loading game....</div>}

            <div className={styles.button_box}>

                {/* Boutons creer ou randomize*/}
                { !InGame && <Matchmaking_Button text="Creer une partie" onClick={GameService.Create_Game} img="game/check"/>}
                { !InGame && <Matchmaking_Button text="Randomize" onClick={GameService.Test} img="game/check"/>}

                {/* Boutons reprendre ou quitter*/}
                { InGame && <Matchmaking_Button text="Reprendre la partie" onClick={GameService.Test} img="game/check"/>}
                { InGame && <Matchmaking_Button text="Quitter la partie" onClick={GameService.Test} img="game/check"/>}

            </div>

            {/* Ajout popup recherche de game lors de randomize */}



        </main>
	);
}
