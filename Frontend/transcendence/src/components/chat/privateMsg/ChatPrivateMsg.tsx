"use client";

import { ChatSocketContext } from "@/context/ChatSocketContext";
import { useContext, useEffect } from "react";
import styles from "@/styles/chat/privateMsg/ChatPrivateMsg.module.css";
import Header from "./Header";
import Conversation from "./Conversation";
import Prompt from "./Prompt";
import { getProfileWithAvatar } from "@/lib/profile/getProfileInfos";

type ChannelType = {
  id: number;
  name: string;
  avatar: Avatar;
};

export default function ChatPrivateMsg() {
  const socket = useContext(ChatSocketContext);

// [?] UUH ?
  //   const token = socket?.io.opts.extraHeaders?.Authorization.split(" ")[1];
  //   console.log(socket?.io.opts.extraHeaders);

//   console.log(token);

  

  // [!] a chopper par les props ensuite
  const selfId:number = 1;
  const friendId: number = 2;

  try {
    const token = socket?.io.opts.extraHeaders?.Authorization.split(" ")[1];
    if (!token) throw new Error("No token value");

    // [!] NOPE, pas de await cote client
    //const friendProfile = await getProfileWithAvatar(token, friendId);

    // const Avatar = new Avatar_Service(token);

    // avatar = await Avatar.getAvatarByName(login);

  } catch (err) {
    console.log(err);
  }


  // creation ou recuperation si existe deja de la channel type private message
  //   useEffect(() => {

  //     console.log("<into> useEffect of <ChatPrivateMsg/>"); //checking

  //     socket?.emit('joinPrivateMsgChannel', { pongieId: friendId }, (payload: {
  //         success: boolean,
  //         channel: ChannelType,
  //     }) => {
  //         console.log(payload)
  //     });

  //   }, [socket])

  return (
    <div className={styles.privateMsgFrame}>
      <Header />
      <Conversation />
      <Prompt />
    </div>
  );
}
