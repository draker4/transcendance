import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/navbar/Navbar.module.css";
import { Socket } from "socket.io-client";
import { Badge } from "@mui/material";
import { useEffect, useState } from "react";

const badgeStyle = {
	"& .MuiBadge-badge": {
	  color: 'var(--tertiary1)',
	  backgroundColor: 'var(--primary1)',
    border: '2px solid var(--notif)',
	  right: "1px",
	}
}

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

    socket?.on('notifMsg', updateNotif);

    updateNotif();

    return () => {
      socket?.off('notifMsg', updateNotif);
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
