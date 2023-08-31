"use client";

import styles from "@/styles/lobby/party/DefineField.module.css";

type Props = {
  inviteId: number;
  setInviteId: Function;
};

export default function Invite({ inviteId, setInviteId }: Props) {
  // ----------------------------------  CHARGEMENT  ---------------------------------- //

  return (
    <div className={styles.invite}>
      <h3 className={styles.section}>Invite Pongies</h3>
    </div>
  );
}
