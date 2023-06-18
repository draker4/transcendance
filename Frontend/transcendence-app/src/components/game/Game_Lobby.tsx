"use client";

//Import les composants react
import { useEffect, useState } from 'react'

//Import les composants
import Matchmaking_Button from '@/components/game/Matchmaking_Button'
import Matchmaking_Search from '@/components/game/Matchmaking_Search'
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
    
    // const Loaded = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const [inGame, setInGame] = useState(false);
    const [gameId, setGameId] = useState("undefined");
    
    let LastSearch = "";

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

    // Fonction qui update la liste des game en fonction de la recherche
    const Update_Game_List = (searchTerm : string) => {
        LastSearch = searchTerm;

        //Parcours le JSON et ne garde que les game qui match avec la recherche
        // if (LastSearch != "") {
        //     JsonGame.filter((item) => item.Name.toLowerCase().includes(LastSearch.toLowerCase()));
        //     console.log("Search term : " + LastSearch);
        //     console.log("Search term : " + LastSearch);
        // }
    };

    //Fonction pour quitter la game en cour
    const Quit_Game = async () => {
        await Game.Quit_Game();
        setInGame(false);
    };

    //Fonction pour rejoindre une game
    const Create_Game = async (gameId : string) => {
        //Creer la popus pour les paramettres
        await Game.Create_Game("test", "test");
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

                {/* Barre de recherche */}
                <Matchmaking_Search onChangeFct={Update_Game_List}/>

                {/* Liste des game en lobby */}
                {<Matchmaking_Game_List token={token} />}
                {/* { JsonGame == "" && <div className={styles.loading}>Loading game....</div>} */}

                {/* Boutons creer ou randomize*/}
                <div className={styles.button_box}>
                    <Matchmaking_Button text="Creer une partie" onClick={Create_Game} img="game/check"/>
                    <Matchmaking_Button text="Randomize" onClick={Game.Test} img="game/check"/>
                </div>
            </main>
        );
    }
}
