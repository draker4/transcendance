import { ReactNode, useState } from "react";
import { Socket } from "socket.io-client";
import styles from "@/styles/chatPage/displayInfos/DisplayInfos.module.css";
import React from "react";
import AvatarUser from "@/components/avatarUser/AvatarUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import SearchBar from "../searchBar/SearchBar";

export default function DisplayInfos({
  icon,
  socket,
  openDisplay,
}: {
  icon: ReactNode;
  socket: Socket;
  openDisplay: (display: Display) => void;
}) {
  const [channels, setChannels] = useState<Channel[]>([]);

  const pongiesList = channels.map((channel) => {
    return (
      <React.Fragment key={channel.id}>
        <div className={styles.list} onClick={() => openDisplay(channel)}>
          <div className={styles.avatar}>
            <AvatarUser
              avatar={channel.avatar}
              borderSize="2px"
              borderColor={channel.avatar.borderColor}
              backgroundColor={channel.avatar.backgroundColor}
            />
          </div>
          <div className={styles.name}>{channel.name}</div>
          <div className={styles.delete}>
            <FontAwesomeIcon icon={faTrashCan} />
          </div>
        </div>
      </React.Fragment>
    );
  });

  socket.emit("getChannels", (channels: Channel[]) => {
    setChannels(channels);
  });

  return (
    <>
      <div className={styles.header}>
        {icon}
        <h3>My Pongies!</h3>
        <div></div>
      </div>
      <div className={styles.main}>
        <div className={styles.search}>
          <SearchBar
            socket={socket}
            search="myChannels"
            openDisplay={openDisplay}
          />
        </div>
        {pongiesList}
      </div>
    </>
  );
}
