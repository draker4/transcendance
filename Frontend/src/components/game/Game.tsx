"use client";

//Import les composants react
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

//Import les services
import LobbyService from "@/services/Lobby.service";
import GameService from "@/services/game/Game.service";

//Import les composants
import styles from "@/styles/game/game.module.css";
import stylesError from "@/styles/game/GameError.module.css";
import Pong from "./Pong";
import WIPPong from "./WIPPong";
import { MdLogout } from "react-icons/md";

import { GameData } from "@Shared/types/Game.types";

type Props = {
  profile: Profile;
  token: String | undefined;
  gameID: String | undefined;
};

export default function Game({ profile, token, gameID }: Props) {
  const lobby = new LobbyService(token);

  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setgameData] = useState<GameData>();
  const [error, setError] = useState<boolean>(false);
  const gameService = new GameService(token as string);

  //------------------------------------Chargement------------------------------------//

  //Regarde si le joueur est en game, si oui , le remet dans la game
  useEffect(() => {
    //Si pas possible d'avoir les données de la game -> retour au lobby
    lobby
      .accessGame(gameID)
      .then((gameData) => {
        if (gameData.success == true && gameService.socket) {
          const data = gameService.socket?.emit("joinGame", gameID);
          setgameData(gameData);
        } else {
          lobby.LoadPage("/home");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        lobby.LoadPage("/home");
        setIsLoading(false);
      });
  }, []);

  const Quit = () => {
    gameService.socket?.disconnect();
    lobby.QuitGame();
    lobby.LoadPage("/home");
  };

  // WsException Managing
  useEffect(() => {
    gameService.socket?.on("exception", () => {
      setError(true);
    });
  }, [gameService.socket]);

  //------------------------------------RENDU------------------------------------//

  // Si une erreur est survenue
  if (!gameService.socket || error) {
    return (
      <div className={stylesError.socketError}>
        <h2>Oops... Something went wrong!</h2>
        <Link href={"/home"} className={stylesError.errorLink}>
          <p>Return to Home Page!</p>
        </Link>
      </div>
    );
  }

  //Si la page n'est pas chargé
  if (isLoading) {
    return (
      <div className={styles.gameLoading}>
        <h1>Chargement...</h1>
      </div>
    );
  }

  //Si la page n'est pas chargé
  if (!isLoading && gameData && gameService.socket) {
    return (
      <div className={styles.game}>
        <WIPPong gameData={gameData}></WIPPong>
        <button onClick={Quit} className={styles.quitBtn}>
          <MdLogout />
          <p className={styles.btnTitle}>Leave</p>
        </button>
      </div>
    );
  }
}
