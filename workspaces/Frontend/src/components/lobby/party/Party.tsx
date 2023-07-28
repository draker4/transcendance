"use client";

import { useState } from "react";
import styles from "@/styles/lobby/party/Party.module.css";
import Lobby_Service from "@/services/Lobby.service";
import CreateParty from "@/components/lobby/party/CreateParty";
import Game_List from "@/components/lobby/party/PartyList";
import { useRef } from "react";

type Props = {
  lobby: Lobby_Service;
  token: string | undefined;
  userId: number;
};

export default function Party({ lobby, userId }: Props) {
  const [createParty, setCreateParty] = useState<boolean>(false);
  const createBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={styles.party}>
      <button
        ref={createBtnRef}
        className={styles.createBtn}
        onClick={() => setCreateParty(!createParty)}
      >
        Create New Party
      </button>

      {createParty && (
        <CreateParty
          lobby={lobby}
          setCreateParty={setCreateParty}
          userId={userId}
          createBtnRef={createBtnRef}
        />
      )}
      {/* {!createParty && <Game_List token={token} />} */}
    </div>
  );
}
