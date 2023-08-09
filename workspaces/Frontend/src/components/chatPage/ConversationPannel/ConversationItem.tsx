import styles from "@/styles/chatPage/Conversations.module.css";
import AvatarUser from "../../avatarUser/AvatarUser";

type Props = {
    channel:Channel,
    handleClick: (channel:Channel) => void;
}


export default function ConversationItem({channel, handleClick}:Props) {

    let date = '';

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
  
    return (
      <div className={styles.list} onClick={() => handleClick(channel)}>
        <div className={styles.avatar}>
          <AvatarUser
            avatar={channel.avatar}
            borderSize="2px"
            borderColor={channel.avatar.borderColor}
            backgroundColor={channel.avatar.backgroundColor}
          />
        </div>
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
