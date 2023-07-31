"use client";

import { Dispatch, SetStateAction, useState } from "react";
import NavbarProfilInfo from "./NavbarProfilInfo";
import SectionPongStats from "./sections/SectionPongStats";
import SectionCustom from "./sections/SectionCustom";
import styles from "@/styles/profile/InfoCard.module.css";
import { Socket } from "socket.io-client";
import SectionPongies from "./sections/SectionPongies";

type Props = {
  profile: Profile;
  isOwner: boolean;
  setLogin: Dispatch<SetStateAction<string>>;
  socket: Socket | undefined;
};

export default function InfoCard({ profile, isOwner, setLogin, socket }: Props) {
  const [activeButton, setActiveButton] = useState(0);

  return (
    <div>
      <NavbarProfilInfo
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        isOwner={isOwner}
      />
      {(() => {
        switch (activeButton) {
          case 0:
            return <SectionPongStats profile={profile} />;
          case 1:
            return <SectionPongies socket={socket} />
          case 2:
            return (
              <div className={styles.sections}>contenu section3 : Channels</div>
            );
          case 3:
            return <SectionCustom profile={profile} setLogin={setLogin} socket={socket}/>;
          default:
            return <SectionPongStats profile={profile} />;
        }
      })()}
    </div>
  );
}
