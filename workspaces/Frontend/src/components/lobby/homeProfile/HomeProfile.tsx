"use client";

import styles from "@/styles/lobby/homeProfile/HomeProfile.module.css";
import Link from "next/link";
import AvatarUser from "../../avatarUser/AvatarUser";
import GameStats from "./GameStats";
import { CSSProperties, useState } from "react";

type Props = {
  profile: Profile;
  avatar: Avatar;
};

export default function HomeProfile({ profile, avatar }: Props) {

  const colorAddedStyle: CSSProperties = {
    background: `linear-gradient(to bottom, ${avatar.borderColor.toString()} 45%, var(--primary1) 45%)`,
  };
  
  return (
    <div className={styles.homeProfil}>

      {/* FACE SIDE */}
      <div className={styles.faceSide} style={colorAddedStyle}>
      <Link className={styles.links} href={`/home/profile/${profile.id}`}>
        <div className={styles.avatarAndLogin}>
          <div className={styles.avatar} >
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
      </div>


      {/* STATS SIDE */}
      <GameStats profile={profile} />

    </div>


  );

}
