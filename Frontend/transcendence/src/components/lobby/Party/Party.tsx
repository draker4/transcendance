"use client";

import React, { useState } from "react";
import styles from "@/styles/lobby/Party/Party.module.css";
import Lobby_Service from "@/services/Lobby.service";
import CreateParty from "@/components/lobby/Party/CreateParty";

type Props = {
  Lobby: Lobby_Service;
  isLoading: boolean;
};

export default function Party({ Lobby, isLoading }: Props) {
  // -------------------------------------  RENDU  ------------------------------------ //
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className={styles.party}>
      <CreateParty Lobby={Lobby} />
    </div>
  );
}
