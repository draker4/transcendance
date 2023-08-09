"use client";

import { useState, Dispatch, SetStateAction, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmileWink,
  faGear,
  faMessage,
  faTableTennisPaddleBall,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import styles from "@/styles/profile/InfoCard.module.css";
import { Socket } from "socket.io-client";
import { Badge } from "@mui/material";

type Props = {
  activeButton: number;
  setActiveButton: Dispatch<SetStateAction<number>>;
  isOwner: boolean;
  socket: Socket | undefined;
};

const badgeStyle = {
	"& .MuiBadge-badge": {
	  color: 'var(--tertiary1)',
	  backgroundColor: 'var(--notif)',
    border: '2px solid var(--notif)',
    borderRadius: "100%",
	}
}

type ButtonData = {
  id: number;
  name: string;
  icon: IconProp;
};

export default function NavbarProfilInfo({
  activeButton,
  setActiveButton,
  isOwner,
  socket,
}: Props) {
  const [selectedItem, setSelectedItem] = useState(0);
  const [invisible, setInvisible] = useState<boolean>(true);
  const idRef = useRef<boolean>(false);

  useEffect(() => {
    const updateProfile = (payload: {
      why: string;
    }) => {
      if (payload && payload.why && payload.why === "updatePongies") {
        socket?.emit('getNotif', (payload: Notif) => {
          if (payload && !idRef.current && (payload.redChannels.length > 0 || payload.redPongies.length > 0))
            setInvisible(false);
          else
            setInvisible(true);
        });
      }
    };

    socket?.emit('getNotif', (payload: Notif) => {
      if (payload && (payload.redChannels.length > 0 || payload.redPongies.length > 0))
        setInvisible(false);
    });

    socket?.on("notif", updateProfile);

    return () => {
      socket?.off("notif", updateProfile);
    };
  }, [socket]);

  const handleClick = (buttonId: number) => {
    if (buttonId === 1) {
      setInvisible(true);
      idRef.current = true;
    }
    else
      idRef.current = false;
    setActiveButton(buttonId);
    setSelectedItem(buttonId);
  };

  const buttonData: ButtonData[] = isOwner
    ? [
        { id: 0, name: "PongStats", icon: faTableTennisPaddleBall },
        { id: 1, name: "Pongies", icon: faFaceSmileWink },
        { id: 2, name: "Channels", icon: faMessage },
        { id: 3, name: "Custom", icon: faGear },
      ]
    : [
        { id: 0, name: "PongStats", icon: faTableTennisPaddleBall },
        { id: 1, name: "Pongies", icon: faFaceSmileWink },
        { id: 2, name: "Channels", icon: faMessage },
      ];

  return (
    <div className={styles.navbar}>
      {buttonData.map((button) => (
        <div
          key={button.id}
          className={`${styles.button} ${
            button.id === selectedItem ? styles.active : ""
          }`}
          onClick={() => handleClick(button.id)}
        >
          {
            (!isOwner || button.name !== "Pongies") &&
            <FontAwesomeIcon icon={button.icon} />
          }
          {
            isOwner && button.name === "Pongies" &&
            <Badge
              overlap="rectangular"
              sx={badgeStyle}
              variant="dot"
              invisible={invisible}
            >
               <FontAwesomeIcon icon={button.icon} />
            </Badge>
          }
          <div>&#8239;{button.name}</div>
        </div>
      ))}
    </div>
  );
}
