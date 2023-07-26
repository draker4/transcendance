"use client";
import styles from "@/styles/lobby/training/Training.module.css";
import LobbyService from "@/services/Lobby.service";

type Props = {
  lobby: LobbyService;
};

export default function Training({ lobby }: Props) {
  // -------------------------------------Traning-------------------------------------//

  return (
    <div className={styles.flip_card}>
      <button className={styles.button_back_card}>
        <p>Create solo game</p>
      </button>
    </div>
  );
}
