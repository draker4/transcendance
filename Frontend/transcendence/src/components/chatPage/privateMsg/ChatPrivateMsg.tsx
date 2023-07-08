"use client";

import styles from "@/styles/chatPage/privateMsg/ChatPrivateMsg.module.css";
import Header from "./Header";
import MessageBoard from "./MessageBoard";
import Prompt from "./Prompt";
import { ReactNode, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Channel_Service from "@/services/Channel.service";
import generateMessageExample from "@/lib/chat/temporaire/messageExample"; // [!] temporaire

type Props = {
  icon: ReactNode;
  pongie: Pongie;
  myself: Profile & { avatar: Avatar };
  socket: Socket;
};

type SendMsg = {
  content: string,
  date: Date,
  senderId: string,
}

export default function ChatPrivateMsg({
  icon,
  pongie,
  myself,
  socket,
}: Props) {
  
  const channelService = new Channel_Service();
  const channelName:string = channelService.formatPrivateMsgChannelName(myself.id, pongie.id);

  // [!] le join de channel devra se faire automatiquement directement dans le chatService 
  // au moment de l'initialisation ==> join toute les channel trouvées pour l'user
  socket.emit('joinPrivateMsgChannel', { "pongieId": pongie.id }, (response:any) => {

    console.log("REPONSE DE JOINPRIVCHANNEL : ", response);
    if (response.success === "true") {
        // socket.join(channelName); NOPE
    }

  });

const me: Pongie = {
    id: myself.id,
    login: myself.login,
    avatar: myself.avatar,
    updatedAt: new Date(), // [?][!] moyen de faire mieux ? une utilité ici ?
  };

  useEffect(() => {
		socket.on('sendMsg', (sendMsg:SendMsg) => {



      console.log("sendMsg event proc -- message = ", sendMsg.content);
      console.log("sendMsg.date : ", sendMsg.date);

      const receivedDate = new Date(sendMsg.date);
      console.log("receivedDate : ", receivedDate);
      console.log("pour receivedDate il est : "  + receivedDate.getHours() + ":" + receivedDate.getMinutes());

      const msg: PrivateMsgType = {
        content: sendMsg.content,
        sender: sendMsg.senderId === pongie.id.toString() ? pongie : me,
        date: receivedDate,
      }
			setMessages((previous) => [...previous, msg]);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

  

  // [!] temporaire
  const messagesExample: PrivateMsgType[] = generateMessageExample(me, pongie);

  // [+] charger les anciens messages --> faire une demande au back-->database lorsque ce sera pret
  const [messages, setMessages] = useState<PrivateMsgType[]>(messagesExample);

  const addMsg = (msg: PrivateMsgType) => {
    // [!] en attendant de passer par le chatSocket
    // setMessages((previous) => [...previous, msg]);

    // [+] emit nouveau message
    socket.emit("newPrivateMsg", {
      content: msg.content,
      channel: channelName,
      // date: msg.date.toISOString(),
      // [!] la date sera gérée en string coté backend
    });
  };

  return (
    <div className={styles.privateMsgFrame}>
      <Header icon={icon} pongie={pongie} />
      <MessageBoard messages={messages} />
      <Prompt pongie={pongie} me={me} addMsg={addMsg} />
    </div>
  );
}
