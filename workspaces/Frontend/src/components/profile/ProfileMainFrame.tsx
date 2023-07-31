"use client"

import styles from "@/styles/profile/Profile.module.css";
import ProfileFirstPart from "./ProfileFirstPart";
import ProfileSecondPart from "./ProfileSecondPart";
import { useState } from "react";
import ChatService from "@/services/chat/Chat.service";

type Props = {
  profile: Profile;
  isOwner: boolean;
  avatar: Avatar;
  token: string;
};

export default function ProfileMainFrame({ profile, isOwner, avatar, token }: Props) {

  const [login, setLogin] = useState<string>(profile.login);
  const chatService = new ChatService(token);

  return (
    <div className={styles.profileMainFrame}>
      <ProfileFirstPart login={login} isOwner={isOwner} avatar={avatar} socket={chatService.socket} />
      <ProfileSecondPart profile={profile} isOwner={isOwner} setLogin={setLogin} socket={chatService.socket} />
    </div>
  );
}
