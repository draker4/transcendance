// PartyInfo.tsx
import { useState } from "react";
import styles from "@/styles/lobby/party/partyList/PartyInfo.module.css";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

import ScoreService from "@/services/Score.service";
import LobbyService from "@/services/Lobby.service";
import { GameInfo } from "@transcendence/shared/types/Game.types";
import PartyDetails from "./PartyDetails";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Props = {
  lobbyService: LobbyService;
  scoreService: ScoreService;
  gameInfo: GameInfo;
};

export default function PartyInfo({
  lobbyService,
  scoreService,
  gameInfo,
}: Props) {
  const router = useRouter();
  const [showDetail, setShowDetail] = useState(false);

  async function joinGame() {
    console.log("Joining game: ", gameInfo.id);
    const res: ReturnData = await lobbyService.joinGame(gameInfo.id);
    console.log("Join game response: ", res);
    await toast.promise(
      new Promise((resolve) => resolve(res)), // Resolve the Promise with 'res'
      {
        pending: "Joing game...",
        success: "Good Luck !",
        error: "Error joining game",
      }
    );
    if (!res.success) {
      console.log(res.message);
      return;
    }
    const url = "home/game/" + res.data;
    router.push(url);
  }

  function watchGame() {
    const url = "home/game/" + gameInfo.id;
    router.push(url);
  }

  return (
    <>
      <div className={styles.partyInfo}>
        <button
          className={styles.detailBtn}
          onClick={() => {
            setShowDetail(!showDetail);
          }}
        >
          {!showDetail && <MdKeyboardArrowRight />}
          {showDetail && <MdKeyboardArrowDown />}
        </button>
        <p className={styles.nameInfo}>{gameInfo.name}</p>
        <p className={styles.typeInfo}>{gameInfo.type}</p>
        <div className={styles.playersInfo}>
          <div>{gameInfo.leftPlayerLogin}</div>
          <p>VS</p>
          <div>{gameInfo.rightPlayerLogin}</div>
        </div>
        <p className={styles.roundInfo}>
          {gameInfo.actualRound} on {gameInfo.maxRound}
        </p>
        <p className={styles.statusInfo}>{gameInfo.status}</p>
        <div className={styles.actionInfo}>
          {(gameInfo.leftPlayerId === -1 || gameInfo.rightPlayerId === -1) && (
            <button className={styles.actionBtn} onClick={joinGame}>
              Join
            </button>
          )}
          {gameInfo.leftPlayerId !== -1 && gameInfo.rightPlayerId !== -1 && (
            <button className={styles.actionBtn} onClick={watchGame}>
              Watch
            </button>
          )}
        </div>
      </div>
      {showDetail && (
        <PartyDetails scoreService={scoreService} gameInfo={gameInfo} />
      )}
    </>
  );
}
