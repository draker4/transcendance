"use client";

import styles from "@/styles/lobby/homeProfile/HomeProfile.module.css";
import GameStats from "./GameStats";
import AvatarProfile from "./AvatarProfile";

type Props = {
  profile: Profile;
  avatar: Avatar;
};

export default function HomeProfile({ profile, avatar }: Props) {
  return (
    <div className={styles.homeProfil}>
      <AvatarProfile profile={profile} avatar={avatar} />
      <GameStats profile={profile} />
    </div>
  );
}
