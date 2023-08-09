import { useEffect, useState } from "react";
import styles from "@/styles/chatPage/Conversations.module.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceLaughBeam,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { Socket } from "socket.io-client";
import SearchBar from "../searchBar/SearchBar";
import { EditChannelRelation } from "@/types/Channel-linked/EditChannelRelation";
import ConversationItem from "./ConversationItem";

export default function Conversations({
  socket,
  maxWidth,
  openDisplay,
}: {
  socket: Socket | undefined;
  maxWidth: string;
  openDisplay: (display: Display) => void;
}) {
  const [notifMsg, setNotifMsg] = useState<NotifMsg[]>([]);

  // ChatWebSocket Management
  useEffect(() => {

    // [!][+] remplacer par getData directement une fois les log inutiles
    const reloadData = (edit:EditChannelRelation) => {
      //console.log("Conversation : editRelation received : ");
      //console.log(edit);
      getData();
    }

    const updateNotif = () => {
      socket?.emit('getNotifMsg', (payload: NotifMsg[]) => {
        setNotifMsg(payload);
      });
    }

    const getData = () => {
      socket?.emit("getChannels", (channels: Channel[]) => {
        console.log("Conversation - GETDATA channelRelationResume : ", channels)

        setChannels(channels);
      });
    }

    const updateChannels = (payload: {
      why: string;
    }) => {
      if (payload && payload.why && payload.why === "updateChannels")
        getData();
    }

    socket?.on("notif", updateChannels);
    socket?.on('notifMsg', updateNotif);
    socket?.on("editRelation", reloadData);

    getData();
    updateNotif();
    
    return () => {
      socket?.off("notif", updateChannels);
      socket?.off("notifMsg", updateNotif);
      socket?.off("editRelation", reloadData);
    }
  }, [socket]);


  // Conversation lists Pannel
  const [channels, setChannels] = useState<Channel[]>([]);

  const handleClickDefault = (channel: Channel) => {
    openDisplay(channel);
  };

  const joinedConversations = channels
  .filter(channel => channel.type !== "privateMsg")
  .map((channel) => (
    channel ? (
      <ConversationItem
        key={channel.id}
        channel={channel}
        handleClick={handleClickDefault}
        notifMsg={notifMsg}
      />
    ) : null
  ));

  const pmConversations = channels
  .filter(channel => channel.type === "privateMsg")
  .map((channel) => (
    channel ? (
      <ConversationItem
        key={channel.id}
        channel={channel}
        handleClick={handleClickDefault}
        notifMsg={notifMsg}
      />
    ) : null
  ));

  const title = joinedConversations.length > 0 ? <h2>Conversations actives</h2> : null;


  const makeConversationList = (conversations:(React.JSX.Element | null)[], title:string):React.JSX.Element | null => {
    if (!conversations || conversations.length === 0) return null;
    return (
      <>
        <p className={styles.tinyTitle}>{title}</p>
        {conversations}
      </>
    );
  };

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
        <div className={styles.icons}>
          {/* <FontAwesomeIcon
            icon={faFaceLaughBeam}
            className={styles.menu}
            onClick={handleClickPongie}
          />
          <FontAwesomeIcon
            icon={faPeopleGroup}
            className={styles.menu}
            onClick={handleClickChannel}
          /> */}
          <FontAwesomeIcon
            icon={faPenToSquare}
            className={styles.menu}
            onClick={handleClickNew}
          />
        </div>
      </div>
      <div className={styles.scroll}>
        
        {makeConversationList(joinedConversations, "Registered Channels")}
        {makeConversationList(pmConversations, "Private messages")}
      </div>
    </div>
  );
}
