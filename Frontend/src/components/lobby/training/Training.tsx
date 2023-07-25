"use client";
import styles from "@/styles/lobby/training/Training.module.css";
import ContentLoading from "../ContentLoading";
import LobbyService from "@/services/Lobby.service";

type Props = {
  lobby: LobbyService;
  isLoading: boolean;
};

export default function Training({ lobby, isLoading }: Props) {
  // -------------------------------------Traning-------------------------------------//

  if (isLoading) {
    return <ContentLoading />;
  }

  return (
    <div className={styles.flip_card}>
      <button className={styles.button_back_card}>
        <p>Create solo game</p>
      </button>
    </div>
  );
}
