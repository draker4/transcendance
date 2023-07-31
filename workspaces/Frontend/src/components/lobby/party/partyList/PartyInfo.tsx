"use client";

import { useState } from "react";
import styles from "@/styles/lobby/party/PartyList.module.css";

import LobbyService from "@/services/Lobby.service";
import { GameInfo } from "@transcendence/shared/types/Game.types";
import { MdArrowForward } from "react-icons/md";

import ScoreService from "@/services/Score.service";
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
    <div className={styles.partyInfo}>
      <button
        onClick={() => {
          setShowDetail(!showDetail);
        }}
      >
        <MdArrowForward />
      </button>

      <p>{gameInfo.name}</p>
      <p>{gameInfo.type}</p>
      <p>{gameInfo.leftPlayer}</p>
      <p>{gameInfo.rightPlayer}</p>
      {showDetail && (
        <div>
          {<PartyDetails scoreService={scoreService} gameInfo={gameInfo} />}
        </div>
      )}
    </div>
  );
}
