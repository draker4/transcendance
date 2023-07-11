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
  content: string;
  date: Date;
  senderId: string;
  channelName: string;
};

export default function ChatPrivateMsg({
  icon,
  pongie,
  myself,
  socket,
}: Props) {
  const channelService = new Channel_Service();
  const channelName: string = channelService.formatPrivateMsgChannelName(
    myself.id,
    pongie.id
  );

  // [!] le join de channel devra se faire automatiquement directement dans le chatService
  // au moment de l'initialisation ==> join toute les channel trouvées pour l'user
  socket.emit(
    "joinPrivateMsgChannel",
    { pongieId: pongie.id },
    (response: any) => {
      console.log("REPONSE DE JOINPRIVCHANNEL : ", response);
      if (response.success === "true") {
        // socket.join(channelName); NOPE
      }
    }
  );

  const me: Pongie = {
    id: myself.id,
    login: myself.login,
    avatar: myself.avatar,
    updatedAt: new Date(), // [?][!] moyen de faire mieux ? une utilité ici ?
  };

  useEffect(() => {
    // Fonction utilisée pour l'abonnement à l'event 'sendMsg'
    // [!] Mauvaise pratique, le register doit etre fait dans un composant parent qui reste monté
    const handleReceivedPrivateMsg = (sendMsg: SendMsg) => {
      const receivedDate = new Date(sendMsg.date);
      const msg: PrivateMsgType = {
        content: sendMsg.content,
        sender: sendMsg.senderId === pongie.id.toString() ? pongie : me,
        date: receivedDate,
      };

	  // [?][!] gerer si un pb de reception qui match pas le bon nom de channel ?
	  if (sendMsg.channelName === channelName)
      	setMessages((previous) => [...previous, msg]);
    };

    // abonement à l'event
    console.log("registering to event 'sendMsg'");
    socket.on("sendMsg", handleReceivedPrivateMsg);

    // En cas de démontage du composant ou de changement de la dépendence socket
    return () => {
      console.log("unregistering to event 'sendMsg'");
      socket.off("sendMsg", handleReceivedPrivateMsg);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // [!] temporaire
  const messagesExample: PrivateMsgType[] = generateMessageExample(me, pongie);

  // [+] charger les anciens messages --> faire une demande au back-->database lorsque ce sera pret
  const [messages, setMessages] = useState<PrivateMsgType[]>(messagesExample);

  const addMsg = (msg: PrivateMsgType) => {
    socket.emit("newPrivateMsg", {
      content: msg.content,
      channel: channelName, // [+] il faudra envoyer plutot le channel id ici
	  channelId: 1, // [!] bricolqge en brut
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

/*
  [!][N] Note, objet message privé :
  Les messages privés envoyés au backend contiennent :
  - content (string < 350 char)
  - channel (string -> nom de la channel privée cible)

  Le nom d'une channel privé est formaté : "idUser1" + " " + "idUser2"

  Pour sécuriser :
  L'identité de l'emmetteur est récupéré dans le token avec @Request
  La date d'envoi est générée par le backend

  Websocket with React : https://socket.io/fr/how-to/use-with-react

*/
