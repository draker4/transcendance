import React from "react";
import styles from "@/styles/profile/Profile.module.css";
import ChannelAvatarCard from "./avatar/ChannelAvatarCard";
import { cookies } from "next/dist/client/components/headers";

type Props = {
	channelAndUsersRelation: ChannelUsersRelation;
	myRelation:UserRelation;
  };

export default function ChannelFirstPart({ channelAndUsersRelation, myRelation }: Props) {
  const token = cookies().get("crunchy-token")?.value;
  const unwrappedToken: string = typeof token === "string" ? token : "";

  return (
    <div className={`${styles.both} ${styles.first}`}>
      <ChannelAvatarCard
        channelAndUsersRelation={channelAndUsersRelation}
		    myRelation={myRelation}
        token={unwrappedToken}
      />
    </div>
  );
}
