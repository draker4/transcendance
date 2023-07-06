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

    {
      content: "When I find myself in times of trouble"
      + "Pikachu comes to me"
      + "Speaking words of wisdom, let it be"
      + "And in my hour of darkness"
      + "Charizard is standing right in front of me"
      + "Whispering words of wisdom, let it be",
      sender: me,
      date: new Date(),
    },

    {
      content:
      + "Let it be, let it be"
      + "Let it be, let it be"
      + "Whisper words of wisdom, let it be",
      sender: me,
      date: new Date(),
    },
      
      {
        content:
      + "And when the night is cloudy"
      + "Jigglypuff starts to sing"
      + "Soothing melodies, let it be"
      + "Oh, when the broken-hearted people"
      + "Find solace in the sea"
      + "Vaporeon shows us all, let it be",
      sender: me,
      date: new Date(),
    },
      
      {
        content:
      + "Let it be, let it be"
      + "Let it be, let it be"
      + "Find solace in the sea, let it be",
      sender: me,
      date: new Date(),
    },
      
      {
        content:
      + "And when the morning sunlight"
      + "Reflects off Butterfree's wings"
      + "We know that love will guide the way, let it be"
      + "For though they may be parted"
      + "Espeon and Umbreon still shine their light"
      + "Leading us to peace, let it be",
      sender: me,
      date: new Date(),
    },

      {
        content:
      + "Let it be, let it be"
      + "Let it be, let it be"
      + "Shining light of peace, let it be",
      sender: me,
      date: new Date(),
    },
      
      {
        content:
      + "Let it be, let it be"
      + "Let it be, let it be"
      + "Whisper words of wisdom, let it be",
      sender: me,
      date: new Date(),
    },

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

    {
      content: "When I find myself in times of trouble"
      + "Pikachu comes to me"
      + "Speaking words of wisdom, let it be"
      + "And in my hour of darkness"
      + "Charizard is standing right in front of me"
      + "Whispering words of wisdom, let it be",
      sender: me,
      date: new Date(),
    },

    {
      content:
      + "Let it be, let it be"
      + "Let it be, let it be"
      + "Whisper words of wisdom, let it be",
      sender: me,
      date: new Date(),
    },
      
      {
        content:
      + "And when the night is cloudy"
      + "Jigglypuff starts to sing"
      + "Soothing melodies, let it be"
      + "Oh, when the broken-hearted people"
      + "Find solace in the sea"
      + "Vaporeon shows us all, let it be",
      sender: me,
      date: new Date(),
    },
      
      {
        content:
      + "Let it be, let it be"
      + "Let it be, let it be"
      + "Find solace in the sea, let it be",
      sender: me,
      date: new Date(),
    },
      
      {
        content:
      + "And when the morning sunlight"
      + "Reflects off Butterfree's wings"
      + "We know that love will guide the way, let it be"
      + "For though they may be parted"
      + "Espeon and Umbreon still shine their light"
      + "Leading us to peace, let it be",
      sender: me,
      date: new Date(),
    },

      {
        content:
      + "Let it be, let it be"
      + "Let it be, let it be"
      + "Shining light of peace, let it be",
      sender: me,
      date: new Date(),
    },
      
      {
        content:
      + "Let it be, let it be"
      + "Let it be, let it be"
      + "Whisper words of wisdom, let it be",
      sender: me,
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
