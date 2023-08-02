"use client";

import { useState } from "react";
import styles from "@/styles/lobby/party/Party.module.css";
import LobbyService from "@/services/Lobby.service";
import CreateParty from "@/components/lobby/party/CreateParty";
import PartyList from "@/components/lobby/lobbyList/LobbyList";
import { useRef } from "react";

type Props = {
  lobbyService: LobbyService;
  profile: Profile;
};

export default function Party({ lobbyService, profile }: Props) {
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
          lobbyService={lobbyService}
          setCreateParty={setCreateParty}
          userId={profile.id}
          createBtnRef={createBtnRef}
        />
      )}
      {!createParty && <PartyList lobbyService={lobbyService} mode={"Party"} />}
    </div>
  );
}
