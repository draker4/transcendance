import { ChatSocketContext } from "@/context/ChatSocketContext";
import avatarType from "@/types/Avatar.type";
import { useContext, useEffect } from "react";
import styles from "@/styles/chat/privateMsg/ChatPrivateMsg.module.css";
import Header from "./Header";

type ChannelType = {
  id: number;
  name: string;
  avatar: avatarType;
};

export default function ChatPrivateMsg() {
  const socket = useContext(ChatSocketContext);

  // [!] a chopper par les props ensuite
  const friendId: number = 2;
  //   console.log(socket?.io.opts.extraHeaders);

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

  return <div className={styles.privateMsgFrame}>
	<Header />
		{/* <Header />
		<Conversation />
		<Prompt /> */}
	</div>;
}
