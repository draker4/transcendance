import styleMain from "@/styles/chatPage/ChatDisplay.module.css";
import styles from "@/styles/chatPage/ChatChannel/ChatChannel.module.css"
import { ReactNode } from "react";
import { Socket } from "socket.io-client";
import {
  faLock,

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PasswordInput from "./PasswordInput";

type Props = {
  display: Channel & {needPassword: boolean};
  icon: ReactNode;
  channel: Channel;
  myself: Profile & { avatar: Avatar };
  socket: Socket | undefined;
  status: Map<string, string>;
}

export default function AskPassword({display, icon, channel, myself, socket, status}: Props) {

  return (
    <div className={styleMain.main}>
      <div className={styles.channelMsgFrame}>
        <div className={styles.popUp}>
          <p className={styles.icon} style={{color: "var(--notif)"}}><FontAwesomeIcon icon={faLock}/></p>
          <h2 style={{color: "var(--accent1)"}}>{display.name}</h2>
          <h2>{"is protected by password"}</h2>
          <PasswordInput display={display} icon={icon}
      channel={display}
      myself={myself}
      socket={socket}
      status={status} />
        </div>
      </div>
    </div>
  )
}
