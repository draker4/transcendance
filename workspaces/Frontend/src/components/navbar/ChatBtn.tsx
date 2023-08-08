import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/navbar/Navbar.module.css";
import { Socket } from "socket.io-client";
import { Badge } from "@mui/material";

const badgeStyle = {
	"& .MuiBadge-badge": {
	  color: 'var(--tertiary1)',
	  backgroundColor: 'var(--primary1)',
    border: '2px solid var(--notif)',
	  right: "1px",
	}
}

export default function ChatBtn({ socket }: { socket: Socket | undefined }) {

  return (
    <Badge badgeContent={1}
      overlap="circular"
      sx={badgeStyle}
    >
      <div className={styles.chatBtn}>
          <FontAwesomeIcon icon={faComments} className={styles.menu} />
      </div>
    </Badge>
  );
}
