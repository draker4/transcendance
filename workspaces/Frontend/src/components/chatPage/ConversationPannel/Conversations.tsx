import { useEffect, useState } from "react";
import styles from "@/styles/chatPage/Conversations.module.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { Socket } from "socket.io-client";
import SearchBar from "../searchBar/SearchBar";
import { EditChannelRelation } from "@/types/Channel-linked/EditChannelRelation";
import ConversationItem from "./ConversationItem";
import Channel_Service from "@/services/Channel.service";

export default function Conversations({
  socket,
  maxWidth,
  openDisplay,
  myself,
}: {
  socket: Socket | undefined;
  maxWidth: string;
  openDisplay: (display: Display) => void;
  myself: Profile & { avatar: Avatar };
}) {
  const [notifMsg, setNotifMsg] = useState<NotifMsg[]>([]);

  const loadData = () => {
    socket?.emit("getChannels", (channels: Channel[]) => {
      // console.log("Conversation - LOADATA channel : ", channels) // checking

      setChannels(channels);
    });
  }

  // ChatWebSocket Management
  useEffect(() => {
    const updateNotif = () => {
      socket?.emit('getNotifMsg', (payload: NotifMsg[]) => {
        setNotifMsg(payload);
      });
    }

    const updateChannels = (payload: {
      why: string;
    }) => {
      if (payload && payload.why && payload.why === "updateChannels")
        loadData();
    }

    socket?.on("notif", updateChannels);
    socket?.on('notifMsg', updateNotif);
    socket?.on("editRelation", loadData);

    loadData();
    updateNotif();
    
    return () => {
      socket?.off("notif", updateChannels);
      socket?.off("notifMsg", updateNotif);
      socket?.off("editRelation", loadData);
    }
  }, [socket]);


  // Conversation lists Pannel
  const [channels, setChannels] = useState<Channel[]>([]);

  const handleClickDefault = (channel: Channel) => {
    openDisplay(channel);
  };

  const handleLeave = async (channel: Channel) => {

    if (channel.joined === false && channel.invited === false) {
      console.log("[+] Feature keepTrack channel [?]"); // [!][+]
      return ;
    }

    try { 
    const channelService = new Channel_Service(undefined);
    const rep:ReturnData = await channelService.editRelation(channel.id, myself.id, {invited:false, joined: false});

    if (rep.success) {
      const newRelation:EditChannelRelation = {
        channelId: channel.id,
        userId: myself.id,
        senderId: myself.id,
        newRelation: {
          joined: false,
          invited:false,
        }
      }
      socket?.emit("editRelation", newRelation);
      // [+] comment fermer le display seulement si la channel quittée est affichée ?
	  
    } else
      throw new Error(rep.message);

	console.log("Conversations => handleLeave => Successfully done"); // checking
    } catch(e:any) {
      console.log("Leave channel error : " + e.message);
    }
  };

  const handleClickAcceptInvite = async (channel: Channel) => {
    console.log("invitation to channel " +  channel.name + "accepted"); // checking

    try {
    const channelService = new Channel_Service(undefined);
    const rep:ReturnData = await channelService.editRelation(channel.id, myself.id, {invited:false, joined: true});

    if (rep.success) {
      const newRelation:EditChannelRelation = {
        channelId: channel.id,
        userId: myself.id,
        senderId: myself.id,
        newRelation: {
          joined: true,
          invited:false,
        }
      }
      socket?.emit("editRelation", newRelation);
      openDisplay(channel);
    }
    else
      throw new Error(rep.message);
    } catch(e:any) {
      console.log("JoinRecent channel error : " + e.message);
    }
  };

  const handleClickJoinRecent = async (channel: Channel) => {
    console.log("Wanna join a recent channel : " + channel.name); // checking
    try {
      const channelService = new Channel_Service(undefined);
      const rep:ReturnData = await channelService.editRelation(channel.id, myself.id, {joined: true});
      
      if (rep.success) {
        const newRelation:EditChannelRelation = {
          channelId: channel.id,
          userId: myself.id,
          senderId: myself.id,
          newRelation: {
            joined: true,
          }
        }
        socket?.emit("editRelation", newRelation);
        openDisplay(channel);
      }
      else
        throw new Error(rep.message);
    } catch(e:any) {
      console.log("JoinRecent channel error : " + e.message);
    }
  };

  const joinedConversations = channels
  .filter(channel => channel.type !== "privateMsg" && channel.joined === true && channel.isBanned === false)
  .map((channel) => (
    channel ? (
      <ConversationItem
        key={channel.id}
        channel={channel}
        handleClick={handleClickDefault}
        handleLeave={handleLeave}
        notifMsg={notifMsg}
        isRecentSection={false}
      />
    ) : null
  ));

  const pmConversations = channels
  .filter(channel => channel.type === "privateMsg" && channel.joined === true)
  .map((channel) => (
    channel ? (
      <ConversationItem
        key={channel.id}
        channel={channel}
        handleClick={handleClickDefault}
        handleLeave={handleLeave}
        notifMsg={notifMsg}
        isRecentSection={false}
      />
    ) : null
  ));

  const invitedConversations = channels
  .filter(channel => channel.type !== "privateMsg" && channel.joined === false && channel.invited === true)
  .map((channel) => (
    channel ? (
      <ConversationItem
        key={channel.id}
        channel={channel}
        handleClick={handleClickAcceptInvite}
        handleLeave={handleLeave}
        notifMsg={notifMsg}
        isRecentSection={false}
      />
    ) : null
  ));

  const recentConversations = channels
  .filter(channel => channel.type !== "privateMsg" && channel.joined === false && channel.invited === false && channel.isBanned === false)
  .map((channel) => (
    channel ? (
      <ConversationItem
        key={channel.id}
        channel={channel}
        handleClick={handleClickJoinRecent}
        handleLeave={handleLeave}
        notifMsg={notifMsg}
        isRecentSection={true}
      />
    ) : null
  ));


  const makeConversationList = (conversations:(React.JSX.Element | null)[], title:string):React.JSX.Element | null => {
    if (!conversations || conversations.length === 0) return null;
    return (
      <>
        <p className={styles.tinyTitle}>{title}</p>
        {conversations}
      </>
    );
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
            icon={faPenToSquare}
            className={styles.menu}
            onClick={handleClickNew}
          />
        </div>
      </div>
      <div className={styles.scroll}>
        {/* */}
        {makeConversationList(joinedConversations, "Registered Channels")}
        {makeConversationList(pmConversations, "Private messages")}
        {makeConversationList(recentConversations, "Recent Channels")}
        {makeConversationList(invitedConversations, "Invitations")}
        {/* */}
      </div>
    </div>
  );
}
