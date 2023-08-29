import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/navbar/Navbar.module.css";
import { Socket } from "socket.io-client";
import { Badge } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const badgeStyle = {
	"& .MuiBadge-badge": {
	  color: 'var(--tertiary1)',
	  backgroundColor: 'var(--primary1)',
    border: '2px solid var(--notif)',
	  right: "1px",
	}
}

// Fresh Messages listened by websocket
type ReceivedMsg = {
  content: string;
  date: string;
  sender: User;
  channelName: string;
  channelId: number;
  isServerNotif: boolean;
  join?: boolean;
};

export default function ChatBtn({ socket }: { socket: Socket | undefined }) {

  const [totalMsg, setTotalMsg] = useState<number>(0);

  useEffect(() => {

    const updateNotif = () => {
      socket?.emit('getNotifMsg', (payload: NotifMsg[]) => {
        let total = 0;
        if (payload && payload.length >= 1) {
          for (const notif of payload) {
            total += notif.nbMessages;
          }
        }
        setTotalMsg(total);
      });
    }

    const handleReceivedMsg = (receivedMsg: ReceivedMsg) => {
      if (receivedMsg.join)
        toast.info(`${receivedMsg.sender.login} invited you to a Pong game!`, {
          position: 'top-center',
        }
      );
    }

    socket?.on('notifMsg', updateNotif);
    socket?.on("sendMsg", handleReceivedMsg);

    updateNotif();

    return () => {
      socket?.off('notifMsg', updateNotif);
      socket?.off("sendMsg", handleReceivedMsg);
    }

  }, [socket]);

  return (
    <Badge badgeContent={totalMsg}
      overlap="circular"
      sx={badgeStyle}
    >
      <div className={styles.chatBtn}>
          <FontAwesomeIcon icon={faComments} className={styles.menu} />
      </div>
    </Badge>
  );
}
