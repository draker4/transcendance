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
          <div className={styles.name}>
            <h4>{channel.name}</h4>
            {
              channel.lastMessage &&
               <p>{
                  channel.lastMessage.user?.login
                  ? channel.lastMessage.user.login
                  : "****"
                }: {channel.lastMessage.content}</p>
            }
          </div>

		{/* [!][+] PROVISOIRE checking */}
		 {/* <div>{`(id:${channel.id})`}</div> */}

        </div>
      </React.Fragment>
    );
  });

  useEffect(() => {

    const getData = () => {
      socket?.emit("getChannels", (channels: Channel[]) => {
        setChannels(channels);
        console.log(channels[0].lastMessage)
      });
    }

    socket.on("notif", () => getData());

    getData();
    
    return () => {
      socket.off("notif");
    }
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
      <SearchBar
        socket={socket}
        openDisplay={openDisplay}
      />

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
      <div className={styles.scroll}>
        {channelsList}
      </div>
    </div>
  );
}
