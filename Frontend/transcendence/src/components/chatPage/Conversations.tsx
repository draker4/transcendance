import { useEffect, useState } from "react";
import AvatarUser from "../avatarUser/AvatarUser";
import styles from "@/styles/chatPage/Conversations.module.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceLaughBeam,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { Socket } from "socket.io-client";
import SearchBar from "./searchBar/SearchBar";

export default function Conversations({
  socket,
  maxWidth,
  openDisplay,
}: {
  socket: Socket;
  maxWidth: string;
  openDisplay: (display: Display) => void;
}) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [pongies, setPongies] = useState<Pongie[]>([]);

  const channelsList = channels.map((channel) => {
    const handleClick = () => {
      openDisplay(channel);
    };

    return (
      <React.Fragment key={channel.id}>
        <div className={styles.list} onClick={handleClick}>
          <div className={styles.avatar}>
            <AvatarUser
              avatar={channel.avatar}
              borderSize="2px"
              borderColor={channel.avatar.borderColor}
              backgroundColor={channel.avatar.backgroundColor}
            />
          </div>
          <div className={styles.name}>{channel.name}</div>
        </div>
      </React.Fragment>
    );
  });

  const pongiesList = pongies.map((pongie) => {
    const handleClick = () => {
      openDisplay(pongie);
    };

    return (
      <React.Fragment key={pongie.id}>
        <div className={styles.list} onClick={handleClick}>
          <div className={styles.avatar}>
            <AvatarUser
              avatar={pongie.avatar}
              borderSize="2px"
              borderColor={pongie.avatar.borderColor}
              backgroundColor={pongie.avatar.backgroundColor}
            />
          </div>
          <div className={styles.name}>{pongie.login}</div>
        </div>
      </React.Fragment>
    );
  });

  useEffect(() => {
    socket?.emit("getChannels", (channels: Channel[]) => {
      setChannels(channels);
    });
    socket?.emit("getPongies", (pongies: Pongie[]) => {
      setPongies(pongies);
    });
  }, [socket]);

  const handleClickPongie = () => {
    openDisplay({ button: "pongies" });
  };

  const handleClickChannel = () => {
    openDisplay({ button: "channels" });
  };

  const handleClickNew = () => {
    openDisplay({ button: "new" });
  };

  return (
    <div className={styles.main} style={{ maxWidth: maxWidth }}>
      <SearchBar socket={socket} search="all" openDisplay={openDisplay} />

      <div className={styles.title}>
        <h3>Discussions</h3>
        <div className={styles.icons}>
          <FontAwesomeIcon
            icon={faFaceLaughBeam}
            className={styles.menu}
            onClick={handleClickPongie}
          />
          <FontAwesomeIcon
            icon={faPeopleGroup}
            className={styles.menu}
            onClick={handleClickChannel}
          />
          <FontAwesomeIcon
            icon={faPenToSquare}
            className={styles.menu}
            onClick={handleClickNew}
          />
        </div>
      </div>
      {channelsList}
      {pongiesList}
    </div>
  );
}
