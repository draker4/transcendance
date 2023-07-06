"use client";

import styles from "@/styles/chatPage/privateMsg/ChatPrivateMsg.module.css";
import Header from "./Header";
import MessageBoard  from "./MessageBoard";
import Prompt from "./Prompt";
import { ReactNode } from "react";


type Props = {
  icon: ReactNode;
  pongie: Pongie;
}

export default function ChatPrivateMsg( { icon, pongie }: Props) {



  return (
    <div className={styles.privateMsgFrame}>
      <Header icon={icon} pongie={pongie}/>
      <MessageBoard />
      <Prompt pongie={pongie}/>
    </div>
  );
}
