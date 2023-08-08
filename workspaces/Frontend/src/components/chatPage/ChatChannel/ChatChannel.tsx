"use client";

import styles from "@/styles/chatPage/ChatChannel/ChatChannel.module.css"
import Header from "./Header";
import MessageBoard from "./MessageBoard";
import Prompt from "./Prompt";
import { ReactNode, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { EditChannelRelation } from "@/types/Channel-linked/EditChannelRelation";
import { RelationNotifPack } from "@/types/Channel-linked/RelationNotifPack";
import { RelationNotif } from "@/lib/enums/relationNotif.enum";


type Props = {
  icon: ReactNode;
  channel: Channel;
  myself: Profile & { avatar: Avatar };
  socket: Socket | undefined;
};

// Fresh Messages listened by websocket
type ReceivedMsg = {
  content: string;
  date: string;
  sender: User;
  channelName: string;
  channelId: number;
  isServerNotif: boolean;
};

// Previous messages loaded from database
type LoadMsg = {
  content: string;
  createdAt: string;
  user: User;
  isServerNotif: boolean;
  updatedAt: string;
};

export default function ChatChannel({ icon, channel, myself, socket }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [codeName, setCodename] = useState<string>("");
  const [relNotif, setRelNotif] = useState<RelationNotifPack>({notif:RelationNotif.nothing, edit:undefined});

  useEffect(() => {
    socket?.emit( "getMessages", {id : channel.id},
      (response: LoadMsg[]) => {
        const previousMsg: Message[] = [];

        response.forEach((item) => {
          const msg: Message = {
            content: item.content,
            sender: item.user,
            date: new Date(item.createdAt),
            isServerNotif: item.isServerNotif,
          };
          previousMsg.push(msg);
        });

		if (channel.type === "privateMsg") {
			socket?.emit("getChannelName", {id : channel.id}, (response: Rep) => {
				if (response.success) {
					setCodename(response.message);
				}
			});
		}
        setMessages(previousMsg);
      }
    );
  }, [channel, socket]);

  const handleEditRelation = (edit:EditChannelRelation) => {
    // [+] features a impl (ex: je me fais ban/kick alors que je suis dans le chat)
    console.log("EditChannelRelation reçu :", edit);

    // [+] CONTINUER ICI
    if (edit !== undefined && edit.userId === myself.id) {
      if (edit.newRelation.isBanned === true)
        setRelNotif({notif:RelationNotif.ban, edit:edit});
      else if (edit.newRelation.joined === false || edit.newRelation.invited === false)
        setRelNotif({notif:RelationNotif.kick, edit:edit});
      else if (edit.newRelation.joined === true || edit.newRelation.isBanned === false)
        setRelNotif({notif:RelationNotif.nothing, edit:edit});
      else if (edit.newRelation.invited === true)
        setRelNotif({notif:RelationNotif.invite, edit:edit});
    }
  }

  useEffect(() => {
    const handleReceivedMsg = (receivedMsg: ReceivedMsg) => {

      console.log(receivedMsg); // checking [!]

      const receivedDate = new Date(receivedMsg.date);
      const msg: Message = {
        content: receivedMsg.content,
        sender: receivedMsg.sender,
        date: receivedDate,
        isServerNotif: receivedMsg.isServerNotif,
      };

	  console.log(`[channel : ${channel.name}] recMsg : ${msg.content}`);

      setMessages((previous) => [...previous, msg]);
    };

    socket?.on("sendMsg", handleReceivedMsg);
    socket?.on("editRelation", handleEditRelation);

    return () => {
      socket?.off("sendMsg", handleReceivedMsg);
      socket?.off("editRelation", handleEditRelation);
    };
    


  }, [channel.name, socket]);

  const addMsg = (msg: Message) => {
    console.log("laaaa", msg);
    socket?.emit("newMsg", {
      content: msg.content,
      channelId: channel.id,
    });
  };

  return (
    <div className={styles.channelMsgFrame}>
      <Header icon={icon} channel={channel} channelCodeName={codeName} myself={myself} />
      <MessageBoard messages={messages} channel={channel} relNotif={relNotif}/>
      <Prompt channel={channel} myself={myself} addMsg={addMsg} relNotif={relNotif}/>
    </div>
  );
}
