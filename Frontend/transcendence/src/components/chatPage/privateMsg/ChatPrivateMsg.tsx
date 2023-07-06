"use client";

import styles from "@/styles/chatPage/privateMsg/ChatPrivateMsg.module.css";
import Header from "./Header";
import MessageBoard  from "./MessageBoard";
import Prompt from "./Prompt";
import { ReactNode, useState } from "react";


type Props = {
  icon: ReactNode;
  pongie: Pongie;
  myself: Profile & { avatar: Avatar };
}

// [!] type temporaire à améliorer
// [?] Avoir 2 types Msg normal et Msg privé ou grouper en un seul ?
type PrivateMsgType = {
  content: string;
  sender: Pongie; // le user emetteur
  date: Date;// date d'emmission ?
  // destination : channel ou pongie ou channel type privateMsg comme backend ?

}

export default function ChatPrivateMsg( { icon, pongie, myself }: Props) {
  
  const me:Pongie = {
    id: myself.id,
    login: myself.login,
    avatar: myself.avatar,
    updatedAt: new Date(), // [?][!] moyen de faire mieux ? une utilité ici ?
  }

  // [!] temporaire
  const messagesExample:PrivateMsgType[] = [
    {
      content: "Bonjour cher ami",
      sender: pongie,
      date: new Date(),
    },

    {
      content: "Yop ! on se fait une game ?",
      sender: me,
      date: new Date(),
    },
    
    {
      content: "J'ai trop envie de cruncher !",
      sender: me,
      date: new Date(),
    },

    {
      content: "Allez, let's Pong !",
      sender: pongie,
      date: new Date(),
    },
  ];

  const [messages, setMessages] = useState<PrivateMsgType[]>(messagesExample);


  const addMsg = (msg: PrivateMsgType) => {
    setMessages((previous) => [...previous, msg]);
  }




  return (
    <div className={styles.privateMsgFrame}>
      <Header icon={icon} pongie={pongie}/>
      <MessageBoard messages={messages}/>
      <Prompt pongie={pongie} me={me} addMsg={addMsg}/>
    </div>
  );
}
