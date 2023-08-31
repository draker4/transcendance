"use client";

import styles from "@/styles/lobby/party/Party.module.css";
import LobbyService from "@/services/Lobby.service";
import CreateParty from "@/components/lobby/party/CreateParty";
import PartyList from "@/components/lobby/lobbyList/LobbyList";

type Props = {
  lobbyService: LobbyService;
  profile: Profile;
};

export default function Party({ lobbyService, profile }: Props) {
  return (
    <div className={styles.party}>
      {<CreateParty lobbyService={lobbyService} userId={profile.id} />}
      {<PartyList lobbyService={lobbyService} mode={"Party"} />}
    </div>
  );
}
