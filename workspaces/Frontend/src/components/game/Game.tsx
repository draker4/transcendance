"use client";

// Import des composants react
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// Import du style
import styles from "@/styles/game/Game.module.css";
import stylesError from "@/styles/game/GameError.module.css";

// Import des services
import LobbyService from "@/services/Lobby.service";
import GameService from "@/services/Game.service";

// Import des composants
import Pong from "./Pong";
import { GameData } from "@transcendence/shared/types/Game.types";

type Props = {
  profile: Profile;
  token: String | undefined;
  gameId: String | undefined;
};

export default function Game({ profile, token, gameId }: Props) {
  const lobby = new LobbyService();

  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState<GameData>();
  const [error, setError] = useState<boolean>(false);
  const gameService = new GameService(token as string);
  const [joinEmitter, setJoinEmitter] = useState<boolean>(false);
  const [isPlayer, setIsPlayer] = useState<"Left" | "Right" | "Spectator">(
    "Spectator"
  );

  //------------------------------------Chargement------------------------------------//

  useEffect(() => {
    if (!joinEmitter) {
      setJoinEmitter(true);
      gameService.socket?.emit("join", gameId, (gameData: any) => {
        if (gameData.success == false) {
          setError(true);
        } else {
          setGameData(gameData.data);
          setIsLoading(false);
          setIsPlayer(
            gameData.data.playerLeft.id === profile.id
              ? "Left"
              : gameData.data.playerRight.id === profile.id
              ? "Right"
              : "Spectator"
          );
        }
      });
    }

    gameService.socket?.on("exception", () => {
      setError(true);
    });
    return () => {
      gameService.socket?.off("exception");
    };
  }, [gameId, gameService.socket, profile, joinEmitter]);

  //------------------------------------RENDU------------------------------------//

  //Si une erreur est survenue
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
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!isLoading && gameData && gameService.socket) {
    return (
      <div className={styles.game}>
        <Pong
          userId={profile.id}
          gameData={gameData}
          setGameData={setGameData}
          socket={gameService.socket}
          isPlayer={isPlayer}
          gameService={gameService}
          lobby={lobby}
        ></Pong>
      </div>
    );
  }
}
