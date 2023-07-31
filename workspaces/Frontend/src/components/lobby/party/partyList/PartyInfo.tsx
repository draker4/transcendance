// PartyInfo.tsx
import { useState } from "react";
import styles from "@/styles/lobby/party/partyList/PartyInfo.module.css";
import {
  MdArrowForward,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";

import ScoreService from "@/services/Score.service";
import LobbyService from "@/services/Lobby.service";
import { GameInfo } from "@transcendence/shared/types/Game.types";
import PartyDetails from "./PartyDetails";

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
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <tr className={styles.partyInfo}>
        <td>
          <button
            className={styles.buttonScore}
            onClick={() => {
              setShowDetail(!showDetail);
            }}
          >
            {!showDetail && <MdKeyboardArrowUp />}
            {showDetail && <MdKeyboardArrowDown />}
          </button>
        </td>
        <td>{gameInfo.name}</td>
        <td>{gameInfo.type}</td>
        <td>{gameInfo.leftPlayer}</td>
        <td>{gameInfo.rightPlayer}</td>
        <td>
          {gameInfo.actualRound} / {gameInfo.maxRound}
        </td>
        <td>{gameInfo.status}</td>
      </tr>
      {showDetail && (
        <PartyDetails scoreService={scoreService} gameInfo={gameInfo} />
      )}
    </>
  );
}
