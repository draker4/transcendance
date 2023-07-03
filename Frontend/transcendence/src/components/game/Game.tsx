"use client";

//Import les composants react
import { useEffect, useState , useRef} from 'react'

//Import les composants
import Button_Img from '../lobby/Button_Img';

//Import le profil
import Profile from "@/services/Profile.service";

//Import le service pour les games
import LobbyService from '@/services/Lobby.service'

//Import le style
import styles from '@/styles/game/game.module.css'

type Props = {
    profile: Profile;
    token: String | undefined;
    gameID: String | undefined;
}

interface GameInfos {
	uuid            : string;
	Name            : string;
	Host            : number;
	Opponent        : number;
	Viewers_List    : number;
	Score_Host      : number;
	Score_Opponent  : number;
	Status          : string;
	CreatedAt       : string;
	Winner          : number;
	Loser           : number;
    Push            : boolean;
    Score           : number;
    Round           : number;
    Difficulty      : number;
    Side            : string;
    Background      : string;
    Ball            : string;
    Paddle          : string;
    Type            : string;
    Mode            : string;
}

export default function Game({ profile, token , gameID}: Props) {

    const Lobby = new LobbyService(token);

    const [isLoading, setIsLoading] = useState(true);
    const [gameInfos, setGameInfo] = useState<GameInfos>();
    
    //------------------------------------Chargement------------------------------------//

    //Regarde si le joueur est en game, si oui , le remet dans la game
    useEffect(() => {

        //Si pas possible d'avoir les données de la game -> retour au lobby
        Lobby.Get_Game_Info(gameID).then((gameInfos) => {
            if (gameInfos.success == false) {
                Lobby.Load_Page("/home/lobby")
            }
            else {
                setGameInfo(gameInfos);
            }
            console.log(gameInfos);
            setIsLoading(false);
        }

        ).catch(error => {
            console.error(error);
            setIsLoading(false);
        }
        );

    }, []);

    const Quit = () => {
        Lobby.Quit_Game();
        Lobby.Load_Page("/home/lobby")
    }


    //------------------------------------RENDU------------------------------------//

    //Si la page n'est pas chargé
    if (isLoading) {
        return (
            <main className={styles.loading_page}>
                <h1>Chargement...</h1>
            </main>
        )
    }

    //Si la page n'est pas chargé
    if (!isLoading) {
        return (

            // @Boisson , tu peux mettre le composant pour la game ici , voici toutes les données auquels tu as acces ici 
            <main className={styles.loading_page}>
                <p>client token        : {token}</p>
                <h1>Game infos    : </h1>
                <p>uuid           : {gameInfos?.uuid} </p>
                <p>Name           : {gameInfos?.Name} </p>
                <p>Host           : {gameInfos?.Host} </p>
                <p>Opponent       : {gameInfos?.Opponent} </p>
                <p>Viewers_List   : {gameInfos?.Viewers_List} </p>
                <p>Score_Host     : {gameInfos?.Score_Host} </p>
                <p>Score_Opponent : {gameInfos?.Score_Opponent} </p>
                <p>Status         : {gameInfos?.Status} </p>
                <p>CreatedAt      : {gameInfos?.CreatedAt} </p>
                <p>Winner         : {gameInfos?.Winner} </p>
                <p>Loser          : {gameInfos?.Loser} </p>
                <p>Push           : {gameInfos?.Push} </p>
                <p>Score          : {gameInfos?.Score} </p>
                <p>Round          : {gameInfos?.Round} </p>
                <p>Difficulty     : {gameInfos?.Difficulty} </p>
                <p>Side           : {gameInfos?.Side} </p>
                <p>Background     : {gameInfos?.Background} </p>
                <p>Ball           : {gameInfos?.Ball} </p>
                <p>Paddle         : {gameInfos?.Paddle} </p>
                <p>Type           : {gameInfos?.Type} </p>
                <p>Mode           : {gameInfos?.Mode} </p>

                <Button_Img text="quit" onClick={Quit} img="lobby/check" />
            </main>
        )
    }

}
