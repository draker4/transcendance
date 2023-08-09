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
 
type RelationResume = {
  isChanOp:boolean,
  joined:boolean,
  invited:boolean,
  banned:boolean
}

type ChannelRelationResume = Channel & {
  relationResume?:RelationResume
}


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
      socket?.emit("getChannels", (channels:ChannelRelationResume[]
      ) => {
        console.log("Conversation - GETDATA channelRelationResume : ", channels)

        setChannels(channels);
      });
    }

    // Baptiste : 
    // actuellement j'utilise cette fonction getData
    // quand j'emit je fais :
    //
    // socket?.emit('notif', {
    //     why: "updateChannels",
    // });
    //
    // a voir ensemble comment on merge ca

    const getData2 = (payload: {
      why: string;
    }) => {
      if (payload && payload.why && payload.why === "updateChannels")
        socket?.emit("getChannels", (channels: Channel[]) => {
          setChannels(channels);
        });
    }

    socket?.on("notif", getData2);
    socket?.on('notifMsg', updateNotif);
    socket?.on("editRelation", reloadData);

    getData();
    
    return () => {
      socket?.off("notif", getData2);
      socket?.off("notifMsg", updateNotif);
      socket?.off("editRelation", reloadData);
    }
  }, [socket]);


  // Conversation lists Pannel
  const [channels, setChannels] = useState<ChannelRelationResume[]>([]);

  const handleClickDefault = (channel:Channel) => {
    openDisplay(channel);
  };

  const joinedConversations = channels
  .filter(channel => channel.relationResume?.joined === true)
  .map((channel) => (
    channel ? (
      <ConversationItem key={channel.id} channel={channel} handleClick={handleClickDefault} />
    ) : null
  ));

  const pmConversations = channels
  .filter(channel => channel.type === "privateMsg")
  .map((channel) => (
    channel ? (
      <ConversationItem key={channel.id} channel={channel} handleClick={handleClickDefault} />
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
