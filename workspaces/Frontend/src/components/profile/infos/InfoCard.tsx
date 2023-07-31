"use client";

import { Dispatch, SetStateAction, useState } from "react";
import NavbarProfilInfo from "./NavbarProfilInfo";
import SectionPongStats from "./sections/SectionPongStats";
import SectionCustom from "./sections/SectionCustom";
import styles from "@/styles/profile/InfoCard.module.css";

type Props = {
  profile: Profile;
  isOwner: boolean;
  setLogin: Dispatch<SetStateAction<string>>;
};

export default function InfoCard({ profile, isOwner, setLogin }: Props) {
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
            return (
              <div className={styles.sections}>contenu section2 : Pongies</div>
            );
          case 2:
            return (
              <div className={styles.sections}>contenu section3 : Channels</div>
            );
          case 3:
            return <SectionCustom profile={profile} setLogin={setLogin} />;
          default:
            return <SectionPongStats profile={profile} />;
        }
      })()}
    </div>
  );
}
