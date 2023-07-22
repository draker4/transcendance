import React from "react";
import styles from "@/styles/profile/Profile.module.css";
import ChannelFirstPart from "./ChannelFirstPart";
import ChannelSecondPart from "./ChannelSecondPart";

type Props = {
  channelAndUsersRelation: ChannelUsersRelation;
  myRelation: UserRelation;
};

export default function ChannelMainFrame({ channelAndUsersRelation, myRelation }: Props) {
  return (
    <div className={styles.profileMainFrame}>
      <ChannelFirstPart channelAndUsersRelation={channelAndUsersRelation} myRelation={myRelation} />
      <ChannelSecondPart channelAndUsersRelation={channelAndUsersRelation} myRelation={myRelation} />
    </div>
  );
}
