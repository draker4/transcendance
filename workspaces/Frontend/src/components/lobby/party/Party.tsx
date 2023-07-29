"use client";

import { useState } from "react";
import styles from "@/styles/lobby/party/Party.module.css";
import LobbyService from "@/services/Lobby.service";
import CreateParty from "@/components/lobby/party/CreateParty";
import PartyList from "@/components/lobby/party/partyList/PartyList";
import { useRef } from "react";

type Props = {
  lobby: LobbyService;
  profile: Profile;
};

export default function Party({ lobby, profile }: Props) {
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
          userId={profile.id}
          createBtnRef={createBtnRef}
        />
      )}
      {/* {!createParty && <PartyList token={token} />} */}
    </div>
  );
}
