"use client";

import styles from "@/styles/lobby/homeProfile/HomeProfile.module.css";
import Link from "next/link";
import AvatarUser from "../../avatarUser/AvatarUser";
import GameStats from "./GameStats";

type Props = {
  profile: Profile;
  avatar: Avatar;
};

export default function HomeProfile({ profile, avatar }: Props) {
  return (
    <div className={styles.homeProfil}>

    <Link className={styles.links} href={`/home/profile/${profile.id}`}>
      <div className={styles.avatarAndLogin}>
        <div className={styles.avatar}>
          <AvatarUser
            avatar={avatar}
            borderSize={"6px"}
            backgroundColor={avatar.backgroundColor}
            borderColor={avatar.borderColor}
            fontSize="3rem"
          />
        </div>
        <div className={styles.login}>{profile.login}</div>
      </div>
    </Link>
      <GameStats profile={profile} />
    </div>
  );
}
