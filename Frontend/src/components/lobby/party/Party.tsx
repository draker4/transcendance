"use client";

import { useState } from "react";
import styles from "@/styles/lobby/party/Party.module.css";
import Lobby_Service from "@/services/Lobby.service";
import CreateParty from "@/components/lobby/party/CreateParty";
import Game_List from "@/components/lobby/party/PartyList";

type Props = {
  lobby: Lobby_Service;
  isLoading: boolean;
  token: string | undefined;
  userId: number;
};

export default function Party({ lobby, isLoading, token, userId }: Props) {
  const [createParty, setCreateParty] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className={styles.party}>
      <button
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
        />
      )}
      {/* {!createParty && <Game_List token={token} />} */}
    </div>
  );
}
