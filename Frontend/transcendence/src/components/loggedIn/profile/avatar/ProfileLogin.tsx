"use client";

import styles from "@/styles/loggedIn/profile/AvatarCard.module.css";
import Profile from "@/services/Profile.service";
import EditButton from "./EditButton";
import { useState } from "react";

type Props = {
  profile: Profile;
  isOwner: boolean;
};

export default function ProfileLogin({ profile, isOwner }: Props) {
  const [editMode, setEditMode] = useState<boolean>(true);

  return (
    <div className={styles.loginCard}>
      <div className={styles.login}>
        <h1>{profile.login}</h1>
      </div>
      {isOwner && <EditButton />}
    </div>
  );
}
