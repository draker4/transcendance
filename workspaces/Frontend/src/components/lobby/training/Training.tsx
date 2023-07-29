"use client";

import { useState } from "react";
import { GameData } from "@transcendence/shared/types/Game.types";
import DefineTraining from "./define/DefineTraining";
import Play from "./play/Play";

type Props = {
  profile: Profile;
  avatar: Avatar;
};

export default function Training({ profile, avatar }: Props) {
  const [gameData, setGameData] = useState<GameData | null>(null);

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
    return (
      <Play userId={profile.id} gameData={gameData} setGameData={setGameData} />
    );
  }
}
