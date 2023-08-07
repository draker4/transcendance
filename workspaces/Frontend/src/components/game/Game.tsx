"use client";

//Import les composants react
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

//Import les services
import LobbyService from "@/services/Lobby.service";
import GameService from "@/services/Game.service";

//Import les composants
import styles from "@/styles/game/Game.module.css";
import stylesError from "@/styles/game/GameError.module.css";
import Pong from "./Pong";
import { MdLogout } from "react-icons/md";

import { GameData } from "@transcendence/shared/types/Game.types";
import { toast } from "react-toastify";

type Props = {
  profile: Profile;
  token: String | undefined;
  gameId: String | undefined;
};

export default function Game({ profile, token, gameId }: Props) {
  const router = useRouter();
  const lobby = new LobbyService();

  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState<GameData>();
  const [error, setError] = useState<boolean>(false);
  const gameService = new GameService(token as string);
  const [joinEmitter, setJoinEmitter] = useState<boolean>(false);
  const [quitStatus, setQuitStatus] = useState<boolean>(false);
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

  async function quit() {
    if (quitStatus) return;
    setQuitStatus(true);
    if (isPlayer === "Spectator") {
      console.log("Quit Spectator");
      router.push("/home");
      return;
    }
    const res = await lobby.quitGame().then(() => {
      gameService.socket?.emit("quit");
      router.push("/home");
    });
    await toast.promise(
      new Promise((resolve) => resolve(res)), // Resolve the Promise with 'res'
      {
        pending: "Leaving game...",
        success: "You have left the game",
        error: "Error leaving game",
      }
    );
  }

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
        ></Pong>
        <button onClick={quit} className={styles.quitBtn}>
          <MdLogout />
          <p className={styles.btnTitle}>Leave</p>
        </button>
      </div>
    );
  }
}