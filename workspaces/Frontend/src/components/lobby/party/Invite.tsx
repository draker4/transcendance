"use client";

import styles from "@/styles/lobby/party/DefineField.module.css";
import { Socket } from "socket.io-client";
import SearchInvite from "./SearchInvite";

type Props = {
  inviteId: number;
  setInviteId: Function;
  socket: Socket;
  profile: Profile;
};

export default function Invite({
  inviteId,
  setInviteId,
  socket,
  profile,
}: Props) {
  // ----------------------------------  CHARGEMENT  ---------------------------------- //

  return (
    <div className={styles.invite}>
      <h3 className={styles.section}>Invite Pongies</h3>
      <SearchInvite socket={socket} profile={profile} />
    </div>
  );
}
