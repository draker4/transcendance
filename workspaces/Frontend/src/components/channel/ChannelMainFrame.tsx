"use client";

import React from "react";
import styles from "@/styles/profile/Profile.module.css";
import ChannelFirstPart from "./ChannelFirstPart";
import ChannelSecondPart from "./ChannelSecondPart";
import { Socket } from "socket.io-client";
import disconnect from "@/lib/disconnect/disconnect";
import { useRouter } from "next/navigation";
import ChatService from "@/services/Chat.service";
import { useEffect, useState } from "react";
import LoadingSuspense from "../loading/LoadingSuspense";
import Avatar_Service from "@/services/Avatar.service";
import Channel_Service from "@/services/Channel.service";

type Props = {
  channelAndUsersRelation: ChannelUsersRelation;
  myRelation: UserRelation;
  token: string;
};

export default function ChannelMainFrame({
  channelAndUsersRelation,
  myRelation,
  token,
}: Props) {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const router = useRouter();
  const id = channelAndUsersRelation.channel.id;
  const [relation, setRelation] = useState<ChannelUsersRelation>(channelAndUsersRelation);
  const [me, setMe] = useState<UserRelation>(myRelation);


  // refresh channel user relation
  const reloadData = async () => {
    const avatarService = new Avatar_Service(undefined);
    const channelService = new Channel_Service(undefined);

    try {
      const updatedRelation = await channelService.getChannelAndUsers(id);
      updatedRelation.channel.avatar = await avatarService.getChannelAvatarById(id);

      const findStatus: UserRelation | undefined =
      updatedRelation.usersRelation.find(
        (relation) => relation.userId === myRelation.userId
      );

      if (findStatus && updatedRelation && updatedRelation.channel.avatar) {
        setMe(findStatus);
        setRelation(updatedRelation);
      }

      console.log("Data Reloaded");
      /* [!]
      console.log("usersRelation[0].isBanned : ", updatedRelation.usersRelation[0].isBanned);
      console.log("usersRelation[1].isBanned : ", updatedRelation.usersRelation[1].isBanned);
      console.log("usersRelation[2].isBanned : ", updatedRelation.usersRelation[2].isBanned);
      console.log("usersRelation[3].isBanned : ", updatedRelation.usersRelation[3].isBanned);
      console.log("usersRelation[4].isBanned : ", updatedRelation.usersRelation[4].isBanned);
      console.log("usersRelation[5].isBanned : ", updatedRelation.usersRelation[5].isBanned);
      */

    } catch(e:any) {
      console.log("Error while updating channel profile : " + e.message);
      // [+] gestion de l'erreure ?
    }
  }


  // Chat Websocket call
  useEffect(() => {
    const handleError = () => {
      setSocket(undefined);
    };

    const disconnectClient = async () => {
      await disconnect();
      router.refresh();
    };

    if (!socket) {
      const intervalId = setInterval(() => {
        const chatService = new ChatService(token);

        if (chatService.disconnectClient) {
          clearInterval(intervalId);
          disconnectClient();
        }

        if (chatService.socket) {
          setSocket(chatService.socket);
          clearInterval(intervalId);
        }
      }, 500);
    }

    socket?.on("editRelation", reloadData);
    socket?.on("notif", reloadData);
    socket?.on("disconnect", handleError);

    return () => {
      socket?.off("editRelation", reloadData);
      socket?.off("notif", reloadData);
      socket?.off("disconnect", handleError);
    };
  }, [socket]);

  if (!socket) return <LoadingSuspense />;

  return (
    <div className={styles.profileMainFrame}>
      <ChannelFirstPart
        token={token}
        channelAndUsersRelation={relation}
        myRelation={me}
      />
      <ChannelSecondPart
        socket={socket}
        channelAndUsersRelation={relation}
        myRelation={me}
      />
    </div>

  );
}
