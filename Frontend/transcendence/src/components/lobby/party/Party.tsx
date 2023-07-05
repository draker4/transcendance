"use client";

import { useState } from "react";
import styles from "@/styles/lobby/party/Party.module.css";
import Lobby_Service from "@/services/Lobby.service";
import CreateParty from "@/components/lobby/party/CreateParty";
import PartyList from "@/components/lobby/party/PartyList";
import ContentLoading from "../ContentLoading";

type Props = {
  Lobby: Lobby_Service;
  isLoading: boolean;
  token: string | undefined;
};

export default function Party({ Lobby, isLoading, token }: Props) {
  // ----------------------------------  CHARGEMENT  ---------------------------------- //
  const [createParty, setCreateParty] = useState<boolean>(false);
  // -------------------------------------  RENDU  ------------------------------------ //
  if (isLoading) {
    return <ContentLoading />;
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
        <CreateParty Lobby={Lobby} setCreateParty={setCreateParty} />
      )}
      {!createParty && <PartyList token={token} />}
    </div>
  );
}
