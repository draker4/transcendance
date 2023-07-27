"use client";

import styles from "@/styles/profile/InfoCard.module.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faFaceSmileWink,
  faUserPlus,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type Props = {
  profile: Profile;
};

type ButtonData = {
  id: number;
  dep: boolean; // dependency
  name: string;
  icon1: IconProp;
  onClick1?: () => void;
  icon2: IconProp;
  onClick2?: () => void;
};

export default function ProfileFooter({ profile }: Props) {
  // [+] recup en socket ou fetch les infos relation user pongie
  const [isPongie, setIsPongie] = useState<boolean>(false);

  const handleAskFriend = () => {
    setIsPongie(true);
  };

  const handleRmFriend = () => {
    setIsPongie(false);
  };

  const buttonData: ButtonData[] = [
    {
      id: 0,
      dep: isPongie,
      name: "AddRmPongie",
      icon1: faUserCheck,
      onClick1: handleRmFriend,
      icon2: faUserPlus,
      onClick2: handleAskFriend,
    },
  ];

  return (
    <div className={styles.profileFooter}>
      {buttonData.map((button) => (
        <FontAwesomeIcon
          key={button.id}
          onClick={button.dep ? button.onClick1 : button.onClick2}
          icon={button.dep ? button.icon1 : button.icon2}
        />
      ))}
    </div>
  );
}
