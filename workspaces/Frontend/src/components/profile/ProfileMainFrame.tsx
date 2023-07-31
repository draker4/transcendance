"use client"

import styles from "@/styles/profile/Profile.module.css";
import ProfileFirstPart from "./ProfileFirstPart";
import ProfileSecondPart from "./ProfileSecondPart";
import { useState } from "react";

type Props = {
  profile: Profile;
  isOwner: boolean;
  avatar: Avatar;
};

export default function ProfileMainFrame({ profile, isOwner, avatar }: Props) {

  const [login, setLogin] = useState<string>(profile.login);

  return (
    <div className={styles.profileMainFrame}>
      <ProfileFirstPart login={login} isOwner={isOwner} avatar={avatar} />
      <ProfileSecondPart profile={profile} isOwner={isOwner} setLogin={setLogin} />
    </div>
  );
}
