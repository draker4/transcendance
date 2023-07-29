"use client";

import { useState } from "react";
import { GameData } from "@transcendence/shared/types/Game.types";
import DefineTraining from "./DefineTraining";
import GameSolo from "../../gameSolo/GameSolo";

type Props = {
  profile: Profile;
  avatar: Avatar;
};

export default function Training({ profile, avatar }: Props) {
  const [gameData, setGameData] = useState<GameData | null>(null);
  console.log("avatar: ", avatar);

  // -----------------------------------  TRAINING  ----------------------------------- //
  if (!gameData) {
    return (
      <DefineTraining
        profile={profile}
        avatar={avatar}
        setGameData={setGameData}
      />
    );
  } else {
    return <GameSolo profile={profile} gameData={gameData} />;
  }
}
