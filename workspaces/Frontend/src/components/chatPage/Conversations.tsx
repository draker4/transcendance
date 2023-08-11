// [+][!] normalement on peut supprimer ce fichier

/*

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
  socket: Socket | undefined;
  maxWidth: string;
  openDisplay: (display: Display) => void;
}) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [notifMsg, setNotifMsg] = useState<NotifMsg[]>([]);
  let date = "";

  const channelsList = channels.map((channel) => {
    const handleClick = () => {
      openDisplay(channel);
    };

    if (channel.lastMessage?.createdAt) {
      const diff = (Date.now() - new Date(channel.lastMessage.createdAt).getTime()) / 1000;
      date = diff < 60
              ? Math.floor(diff) + "s"
              : diff < 3600
              ? Math.floor(diff / 60) + "min"
              : diff < 86400
              ? Math.floor(diff / 60 / 60) + "h"
              : diff < 604800
              ? Math.floor(diff / 60 / 60 / 24) + "d"
              : Math.floor(diff / 60 / 60 / 24 / 7) + "w"
    }

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

          <div className={styles.time}>
            {
              channel.lastMessage &&
              <p>
                {date}
              </p>
            }
          </div>


        </div>
      </React.Fragment>
    );
  });

  useEffect(() => {

    const getData = (payload: {
      why: string;
    }) => {
      if (payload && payload.why && payload.why === "updateChannels")
        socket?.emit("getChannels", (channels: Channel[]) => {
          setChannels(channels);
        });
    }

    const updateNotif = () => {
      socket?.emit('getNotifMsg', (payload: NotifMsg[]) => {
        setNotifMsg(payload);
      });
    }

    socket?.on('notifMsg', updateNotif);

    socket?.on("notif", getData);

    socket?.emit("getChannels", (channels: Channel[]) => {
      setChannels(channels);
    });
    
    return () => {
      socket?.off("notif", getData);
      socket?.off("notifMsg", updateNotif);
    }
  }, [socket]);

  // const handleClickPongie = () => {
  //   openDisplay({ button: "pongies" });
  // };

  // const handleClickChannel = () => {
  //   openDisplay({ button: "channels" });
  // };

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
          <FontAwesomeIcon
            icon={faPenToSquare}
            className={styles.menu}
            onClick={handleClickNew}
          />
      </div>
      <div className={styles.scroll}>
        {channelsList}
      </div>
    </div>
  );
}

*/
