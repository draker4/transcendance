// "use client";

// //Import les composants react
// import { useEffect, useState } from 'react'

// //Import les composants
// import Flip_Card    from '@/components/lobby/noupdated/Flip_Card'
// import Game_Card    from '@/components/lobby/Game_Card'
// import Game_List    from '@/components/lobby/Game_List'

// type Props = {
//     profile: Profile;
//     token: string | undefined;
// }

// //Import le service pour les games
// import LobbyService from '@/services/Lobby.service'
// import styles from '@/styles/lobby/Lobby.module.css'

// export default function Lobby({ profile, token }: Props) {

//     const Lobby = new LobbyService(token);

//     const [isLoading, setIsLoading]         = useState(true);
//     const [gameInfos, setGameInfo]          = useState("undefined");

//     //------------------------------------Chargement------------------------------------//

//     //Regarde si le joueur est en game, si oui , le remet dans la game
//     useEffect(() => {

//         //Si deja en game -> resume game
//         Lobby.IsInGame().then((cur_game_id) => {

//             if (cur_game_id != false) {
//                 Lobby.Resume_Game(cur_game_id)
//             }
//             setIsLoading(false);
//         })

//         .catch(error => {
//             console.error(error);
//             setIsLoading(false);
//         });

//     }, []);

//     //------------------------------------RENDU------------------------------------//

//     //Si la page n'est pas chargé
//     if (isLoading) {
//         return (
//             <main className={styles.loading_page}>
//                 <h1>Chargement...</h1>
//             </main>
//         )
//     }

//     //Si le joueur n'est pas en game
//     if (!isLoading){
//         return (

//             <main className={styles.main}>

//                 {/*Premiere page bouton en haut  */}
//                 <div className={styles.haut}>
//                     <Flip_Card Lobby={Lobby} text="Create game and play with your friend"       title="Create a game"   img="lobby/joystick"       type="create"/>
//                     <Flip_Card Lobby={Lobby} text="Training in solo against an AI"              title="Training"        img="lobby/training"     type="training"/>
//                     <Flip_Card Lobby={Lobby} text="Random opponent , fight for the ladder"      title="Ranked"          img="lobby/rank"         type="rank"/>
//                 </div>

//                 {/*Premiere page bouton en haut  */}
//                 <div className={styles.bas}>

//                     {/* div gauche */}
//                     <div className={styles.gauche}>
//                         <Game_Card token={token} game_id={gameInfos}/>
//                     </div>

//                     {/* div droite */}
//                     <div className={styles.droite}>

//                         {/* Liste des game en lobby */}
//                         <Game_List token={token} />

//                     </div>
//                 </div>

//             </main>
//         );
//     }
// }
