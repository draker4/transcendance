"use client";

import styles from "@/styles/chatPage/ChatChannel/ChatChannel.module.css"
import Header from "./Header";
import MessageBoard from "./MessageBoard";
import Prompt from "./Prompt";
import { ReactNode, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type Props = {
  icon: ReactNode;
  channel: Channel;
  myself: Profile & { avatar: Avatar };
  socket: Socket;
};

// Fresh Messages listened by websocket
type ReceivedMsg = {
  content: string;
  date: string;
  sender: User;
  channelName: string;
  channelId: number;
};

// Previous messages loaded from database
type LoadMsg = {
  content: string;
  createdAd: string;
  user: User;
  isServerNotif: boolean;
  updatedAt: string;
};

export default function ChatChannel({ icon, channel, myself, socket }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  let channelCodeName:string | undefined = undefined;

  useEffect(() => {
    socket.emit( "getMessages", channel.id,
      (response: LoadMsg[]) => {
        const previousMsg: Message[] = [];

        response.forEach((item) => {
          const msg: Message = {
            content: item.content,
            sender: item.user,
            date: new Date(item.createdAd),
          };
          previousMsg.push(msg);
        });

		if (channel.type === "privateMsg") {
			// [!] en brut pour l  moment
			socket.emit("getChannelName", channel.id);
			// , (response :string) => {
				// [!] Warning ici dans le useEffect
				// [+] finir une fois que channel.if ne sera pas undefined
				// channelCodeName = response;
			// });
		}

        setMessages(previousMsg);
      }
    );
    //   eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleReceivedMsg = (receivedMsg: ReceivedMsg) => {

      const receivedDate = new Date(receivedMsg.date);
      const msg: Message = {
        content: receivedMsg.content,
        sender: receivedMsg.sender,
        date: receivedDate,
      };

    //   console.log("event 'sendMsg' proc -> msg = ", msg); // [!] checking

      setMessages((previous) => [...previous, msg]);
    };

    socket.on("sendMsg", handleReceivedMsg);

    return () => {
      socket.off("sendMsg", handleReceivedMsg);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const addMsg = (msg: Message) => {
    socket.emit("newMsg", {
      content: msg.content,
      channelId: channel.id,
    });
  };

  return (
    <div className={styles.channelMsgFrame}>
      <Header icon={icon} channel={channel} channelCodeName={channelCodeName} myself={myself} />
      <MessageBoard messages={messages} />
      <Prompt channel={channel} myself={myself} addMsg={addMsg} />
    </div>
  );
}
