"use client";
import styles from "@/styles/lobby/history/History.module.css";
import ContentLoading from "../ContentLoading";
import LobbyService from "@/services/Lobby.service";

type Props = {
  Lobby: LobbyService;
  isLoading: boolean;
};

export default function History({ Lobby, isLoading }: Props) {
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
