"use client";

import styles from "@/styles/chatPage/ChatChannel/ChatChannel.module.css"
import Header from "./Header";
import MessageBoard from "./MessageBoard";
import Prompt from "./Prompt";
import { ReactNode, useEffect, useRef, useState } from "react";
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
  const [codeName, setCodename] = useState<string>("");

  useEffect(() => {
    socket.emit( "getMessages", {id : channel.id},
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
			socket.emit("getChannelName", {id : channel.id}, (response: Rep) => {
				if (response.success) {
					setCodename(response.message);
				}
			});
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
      <Header icon={icon} channel={channel} channelCodeName={codeName} myself={myself} />
      <MessageBoard messages={messages} />
      <Prompt channel={channel} myself={myself} addMsg={addMsg} />
    </div>
  );
}
