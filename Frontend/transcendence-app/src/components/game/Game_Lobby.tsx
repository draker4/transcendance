"use client";

//Import les composants react
import { useEffect, useState } from 'react'

//Import les composants
import Matchmaking_Button from '@/components/game/Matchmaking_Button'
import Matchmaking_Game_List from '@/components/game/Matchmaking_Game_List'

//Import le profil
import Profile from "@/services/Profile.service";

type Props = {
    profile: Profile;
    token: String | undefined;
}

//Import le service pour les games
import GameService from '@/services/Game.service'
import styles from '@/styles/game/game.module.css'

export default function Game_Lobby({ profile, token }: Props) {
    
    const Game = new GameService(token);
    
    //Pour le chargement ingame not in game
    const [isLoading, setIsLoading] = useState(true);
    const [inGame, setInGame] = useState(false);
    const [gameId, setGameId] = useState("undefined");

    //Pour la creation de la game
    const [gameName, setGameName] = useState("");
    const [gamePassword, setGamePassword] = useState("");
    const [createError, setCreateError] = useState("");

    useEffect(() => {

        Game.IsInGame().then((cur_game_id) => {
            
            if (cur_game_id != false) {
                setGameId(cur_game_id);
                setInGame(true);
            }
            
            setIsLoading(false);
        })

        .catch(error => {
            console.error(error);
            setIsLoading(false);
        });

    }, []);

    //Fonction pour quitter la game en cour
    const Quit_Game = async () => {
        await Game.Quit_Game();
        setInGame(false);
    };

    //Fonction pour rejoindre une game
    const Create_Game = async (gameId : string) => {
        if (gameName == ""){
            setCreateError("Veuillez entrer un nom de partie");
            return;
        }
        await Game.Create_Game(gamePassword, gameName);
    };

    const handle_Game_Name = (event : any) => {
        setGameName(event.target.value);
    };
    
    const handle_Game_Password = (event : any) => {
        setGamePassword(event.target.value);
    };

    //------------------------------------RENDU------------------------------------//

    //Si la page n'est pas chargé
    if (isLoading) {
        return <p>Loading...</p>; 
    }

    //Si le joueur est en game
    if (!isLoading && inGame){
        return (
            <main className={styles.main}>
                {/* Boutons reprendre ou quitter*/}
                { inGame && <Matchmaking_Button text="Reprendre la partie" onClick={() => Game.Resume_Game(gameId)} img="game/check"/>}
                { inGame && <Matchmaking_Button text="Quitter la partie" onClick={Quit_Game} img="game/check"/>}
            </main>
        );
    }

    //Si le joueur n'est pas en game
    if (!isLoading && !inGame){
        return (
            <main className={styles.main}>

                {/* Liste des game en lobby */}
                {<Matchmaking_Game_List token={token} />}

                {/* Boutons creer ou randomize*/}
                <div className={styles.button_box}>
                    <div className={styles.game_param}>
                        <div> <input  className={styles.game_input} type="text" onChange={handle_Game_Name} placeholder="Nom de la partie" /></div>
                        <div> <input  className={styles.game_input} type="text" onChange={handle_Game_Password} placeholder="Mot de passe" />    </div>
                        <div> <p className={styles.error}>{createError}</p>    </div>
                    </div>
                    <Matchmaking_Button text="Créer une partie" onClick={Create_Game} img="game/check"/>
                    <Matchmaking_Button text="Randomize" onClick={Game.Test} img="game/check"/>
                </div>              
            </main>
        );
    }
}
