"use client";

import styles from "@/styles/chatPage/privateMsg/ChatPrivateMsg.module.css";
import Header from "./Header";
import MessageBoard from "./MessageBoard";
import Prompt from "./Prompt";
import { ReactNode, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Channel_Service from "@/services/Channel.service"; // [!] a totalement supprimer ?
import generateMessageExample from "@/lib/chat/temporaire/messageExample"; // [!] temporaire

type Props = {
  icon: ReactNode;
  channel: Channel;
  myself: Profile & { avatar: Avatar };
  socket: Socket;
};

type SendMsg = {
  content: string;
  date: Date;
  senderId: string; // [?]number ?
  channelName: string; // [?] ID ?
};

type ReceivedMsg = {
	content: string,
	createdAd: string,
	user: User,
    isServerNotif: boolean,
    updatedAt: string, // not needed
}

export default function ChatChannel({
  icon,
  channel,
  myself,
  socket,
}: Props) {


//   const channelService = new Channel_Service();
//   const channelName: string = channelService.formatPrivateMsgChannelName(
//     myself.id,
//     pongie.id
//   );

  // [!] le join de channel devra se faire automatiquement directement dans le chatService
  // au moment de l'initialisation ==> join toute les channel trouvées pour l'user
	//   socket.emit(
	//     "joinPrivateMsgChannel",
	//     { pongieId: pongie.id },
	//     (response: any) => {
	//       console.log("REPONSE DE JOINPRIVCHANNEL : ", response);
	//       if (response.success === "true") {
	//         // socket.join(channelName); NOPE
	//       }
	//     }
	//   );

//   const me: User = {
// 	  id: myself.id,
// 	  login: myself.login,
// 	  avatar: myself.avatar,
// 	};
	
	// const unknownUser: User = {
	//   id: 0,
	//   login: "unknow",
	//   avatar: {
	// 	  name: "unknow",
	// 	  image: "",
	// 	  variant: "circular",
	// 	  borderColor: "#22d3ee",
	// 	  backgroundColor: "#565656",
	// 	  text: "UK",
	// 	  empty: true,
	// 	  isChannel: false,
	// 	  decrypt: false
	// 	}
	// }

	const [messages, setMessages] = useState<Message[]>([]);
	// 	// const [users, setUsers] = useState<Map<number, User>>(new Map());
	
	
	// PAS BESOIN DE CHARGER TOUS LES USER ICI, pour le moment
// 	useEffect(() => {
// 	  // j'aurais acces a ce channel id une fois que bperriol aura remanie
// 	  socket.emit("getChannelUsers", { channelId:channel.id }, (userRep:User[]) => {
// 		  if (userRep) {
// 			//   console.log("userRep : ", userRep);
// 			  userRep.forEach((user) => {
// 				  const usersMap = new Map(users);
// 				  usersMap.set(user.id, user);
// 				  setUsers(usersMap);
// 				})
// 			}
// 	  });
//   //   [+][!] Dependence devrait etre lie aux server notif lorsqu'un nouvel user join
//   //   eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, []);
	
	
	
	
  //   useEffect to load previous messages - dependecies : [] to load it only once
  // [+] TODOafter
  useEffect(() => {
	// j'aurais acces a ce channel id une fois que bperriol aura remanie
	socket.emit("getMessages", { channelId:channel.id}, (response:ReceivedMsg[]) => {

		// console.log("reponse : ", response);
		const previousMsg:Message[] = [];
		// [+] extraire cette fonction ? ou plutot le tout
		response.forEach((item) => {

			// console.log("item.sender = ", item.user);

			const msg: Message = {
				content: item.content,
				sender: item.user,
				date: new Date(item.createdAd),
			}
			previousMsg.push(msg);
		});

		setMessages(previousMsg);

	});
//   no dependencies, only want to effect it only once
//   eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  useEffect(() => {
    // Fonction utilisée pour l'abonnement à l'event 'sendMsg'
    // [!] Mauvaise pratique, le register doit etre fait dans un composant parent qui reste monté
    const handleReceivedMsg = (sendMsg: SendMsg) => {
      const receivedDate = new Date(sendMsg.date);
      const msg: Message = {
        content: sendMsg.content,
        sender: myself,// [!] a chopper depuis message,
        date: receivedDate,
      };

	  console.log("event 'sendMsg' proc -> msg = ", msg);

	//  [?][!] gerer si un pb de reception qui match pas le bon nom de channel ?
	//  if (sendMsg.channelName === channelName)
      	setMessages((previous) => [...previous, msg]);
    };

    // abonement à l'event
    console.log("registering to event 'sendMsg'");
    socket.on("sendMsg", handleReceivedMsg);

    // En cas de démontage du composant ou de changement de la dépendence socket
    return () => {
      console.log("unregistering to event 'sendMsg'");
      socket.off("sendMsg", handleReceivedMsg);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);



  // [!] temporaire
//   const messagesExample: PrivateMsgType[] = generateMessageExample(me, pongie);


  const addMsg = (msg: Message) => {
    socket.emit("newMsg", {
      content: msg.content,
      channel: channel.name, // [+] a supprimer, le channel name est plus bon, utiliser id en back
	  channelId: channel.id, // [!] bricolqge en brut
    });
  };

//   console.log("messages = ", messages);

  return (
    <div className={styles.privateMsgFrame}>
      <Header icon={icon} channel={channel} />
      <MessageBoard messages={messages} />
      <Prompt channel={channel} myself={myself} addMsg={addMsg} />
    </div>
  );
}

/*
  [!][N] Note, objet message :
  Les messages privés envoyés au backend contiennent :
  - content (string <= 350 char)
  - channel (string -> nom de la channel privée cible)

  Le nom d'une channel privé est formaté : "idUser1" + " " + "idUser2"

  Pour sécuriser :
  L'identité de l'emmetteur est récupéré dans le token avec @Request
  La date d'envoi est générée par le backend

  Websocket with React : https://socket.io/fr/how-to/use-with-react
*/
