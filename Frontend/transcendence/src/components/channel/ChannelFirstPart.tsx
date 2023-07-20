import React from "react";
import styles from "@/styles/profile/Profile.module.css";
import ChannelAvatarCard from "./avatar/ChannelAvatarCard";
import { cookies } from "next/dist/client/components/headers";

type Props = {
  userStatus: UserStatusInChannel;
  avatar: Avatar;
};

export default function ChannelFirstPart({ avatar, userStatus }: Props) {
  const token = cookies().get("crunchy-token")?.value;
  const unwrappedToken: string = typeof token === "string" ? token : "";

  return (
    <div className={`${styles.both} ${styles.first}`}>
      <ChannelAvatarCard
        avatar={avatar}
        userStatus={userStatus}
        token={unwrappedToken}
      />
    </div>
  );
}
