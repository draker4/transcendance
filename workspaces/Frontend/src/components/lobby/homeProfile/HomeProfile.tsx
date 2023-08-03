"use client";

import styles from "@/styles/lobby/homeProfile/HomeProfile.module.css";
import AvatarUser from "../../avatarUser/AvatarUser";
import GameStats from "./GameStats";

type Props = {
  profile: Profile;
  avatar: Avatar;
};

export default function HomeProfile({ profile, avatar }: Props) {
  return (
    <div className={styles.homeProfil}>
      <div className={styles.avatar}>
        <AvatarUser
          avatar={avatar}
          borderSize={"6px"}
          backgroundColor={avatar.backgroundColor}
          borderColor={avatar.borderColor}
        />
      </div>
      <div className={styles.profileInfo}>
        <p>{profile.login}</p>
        <p>{profile.story}</p>
      </div>
      <GameStats profile={profile} />
    </div>
  );
}
