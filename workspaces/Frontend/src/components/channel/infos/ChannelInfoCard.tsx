"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/profile/InfoCard.module.css";
import NavbarChannelInfo from "./NavbarChannelInfo";
import SectionPongers from "./sections/SectionPongers";
import { Socket } from "socket.io-client";

type Props = {
  channelAndUsersRelation: ChannelUsersRelation;
  myRelation: UserRelation;
  socket: Socket | undefined;
};

export default function ChannelInfoCard({
  channelAndUsersRelation,
  myRelation,
  socket
}: Props) {
  const [activeButton, setActiveButton] = useState(0);
 
  return (
    <>
      <NavbarChannelInfo
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        myRelation={myRelation}
      />
      {(() => {
        switch (activeButton) {
          case 0:
            return (
              <SectionPongers
                channelAndUsersRelation={channelAndUsersRelation}
                myRelation={myRelation} socket={socket}
              />
            );
          case 1:
            return (
              <div className={styles.sections}>contenu section2 : Channel</div>
            );
          case 2:
            return (
              <div className={styles.sections}>contenu section3 : Custom</div>
            );
          default:
            return (
              <div className={styles.sections}>
                contenu section? : default switch reached
              </div>
            );
        }
      })()}
    </>
  );
}
