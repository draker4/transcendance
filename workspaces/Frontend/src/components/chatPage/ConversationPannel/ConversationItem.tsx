import styles from "@/styles/chatPage/Conversations.module.css";
import AvatarUser from "../../avatarUser/AvatarUser";
import { Badge } from "@mui/material";
import { useState } from "react";

type Props = {
    channel:Channel,
    handleClick: (channel:Channel) => void;
    notifMsg: NotifMsg[];
}

const badgeStyle = {
	"& .MuiBadge-badge": {
	  color: 'var(--tertiary1)',
	  backgroundColor: 'var(--primary1)',
    border: '2px solid var(--notif)',
	  right: "1px",
	}
}

export default function ConversationItem({channel, handleClick, notifMsg}:Props) {

    let date = '';
    let nbMsg = 0;
    // const [nbMsg, setNbMsg] = useState<number>(0);

    if (channel.lastMessage?.createdAt) {
      const diff = (Date.now() - new Date(channel.lastMessage.createdAt).getTime()) / 1000;
      date = diff < 60
        ? Math.floor(diff) + 's'
        : diff < 3600
        ? Math.floor(diff / 60) + 'min'
        : diff < 86400
        ? Math.floor(diff / 60 / 60) + 'h'
        : diff < 604800
        ? Math.floor(diff / 60 / 60 / 24) + 'd'
        : Math.floor(diff / 60 / 60 / 24 / 7) + 'w';
    }

    if (notifMsg.length >= 1) {
      for (const notif of notifMsg) {
        if (notif.channelId === channel.id)
          nbMsg = notif.nbMessages;
      }
    }
  
    return (
      <div className={styles.list} onClick={() => handleClick(channel)}>
        
        <Badge badgeContent={nbMsg}
          overlap="circular"
          sx={badgeStyle}
        >
          <div className={styles.avatar}>
            <AvatarUser
              avatar={channel.avatar}
              borderSize="2px"
              borderColor={channel.avatar.borderColor}
              backgroundColor={channel.avatar.backgroundColor}
            />
          </div>
        </Badge>
        
        <div className={styles.name}>
          <h4>{channel.name}</h4>
          {channel.lastMessage && (
            <p>
              {channel.lastMessage.user?.login ? channel.lastMessage.user.login : '****'}:{' '}
              {channel.lastMessage.content}
            </p>
          )}
        </div>
  
        <div className={styles.time}>
          {channel.lastMessage && <p>{date}</p>}
        </div>
      </div>
    );
}
