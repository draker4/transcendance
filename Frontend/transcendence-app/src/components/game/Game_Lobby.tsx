"use client";

//Import les composants react
import { useEffect, useState , useRef} from 'react'

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
    const JsonGame = null;

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

        // const interval = setInterval(() => {
        //     //Get la liste des game en cours
        //     //Update la recherche
        //     console.log("Refresh game liste");
        // }, 5000);
        // return () => clearInterval(interval);

    }, []);

    // Defini une fonction qui sera appelee par le composant Matchmaking_Search et affiche dans la console le terme recherche
    const Update_Game_List = (searchTerm : string) => {
        LastSearch = searchTerm;
        console.log("Search term : " + LastSearch);
    };

    //Fonction pour quitter la game en cour
    const Quit_Game = async () => {
        await Game.Quit_Game();
        setInGame(false);
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
                { JsonGame && <Matchmaking_Game_List json={JsonGame} />}
                { !JsonGame && <div className={styles.loading}>Loading game....</div>}

                {/* Boutons creer ou randomize*/}
                <div className={styles.button_box}>
                    <Matchmaking_Button text="Creer une partie" onClick={() => Game.Create_Game("truc", "test")} img="game/check"/>
                    <Matchmaking_Button text="Randomize" onClick={Game.Test} img="game/check"/>
                </div>
            </main>
        );
    }
}
