import styles from "@/styles/chatPage/ChatChannel/ChatChannel.module.css";
import AvatarUser from "@/components/avatarUser/AvatarUser";
import makeHumanDateFormat from "@/lib/chat/makeHumanDateFormat";

type GroupedMsgType = {
  user: User;
  date: Date;
  messages: Message[];
  isServerNotif: boolean;
};

type Props = {
  groupedMessages: GroupedMsgType;
};

export default function MessageItem({ groupedMessages }: Props) {
  const mappingMessages = groupedMessages.messages.map((msg, index) => (
    <pre key={index}>{msg.content}</pre>
  ));

  const formatedDate = makeHumanDateFormat(groupedMessages.date);

  // Server Notif Message
  if (groupedMessages.isServerNotif) {
    return (
      <div className={styles.msgItem}>
        {
          <div className={styles.avatarSide}>
            <div className={styles.notifDate}> {formatedDate} </div>
          </div>
        }
        <div className={styles.textSide}>
          <div className={`${styles.content} ${styles.serverNotif}`}>
            {mappingMessages}
          </div>
        </div>
      </div>
    );
  }

  // User Message
  return (
    <div className={styles.msgItem}>
      {/* Avatar Side */}
      {
        <div className={styles.avatarSide}>
          <div className={styles.avatarSlot}>
            <AvatarUser
              avatar={groupedMessages.user.avatar}
              borderSize="3px"
              borderColor={groupedMessages.user.avatar.borderColor}
              backgroundColor={groupedMessages.user.avatar.backgroundColor}
              fontSize="1rem"
            />
          </div>
        </div>
      }

      {/* Text Side */}
      <div className={styles.textSide}>
        {/* Header */}
        <div className={styles.tsheader}>
          <div
            className={styles.name}
            style={{ color: groupedMessages.user.avatar.borderColor }}
          >
            {groupedMessages.user.login}
          </div>
          <div className={styles.date}>{formatedDate}</div>
        </div>
        {/* Content */}
        <div className={styles.content}>{mappingMessages}</div>
      </div>
    </div>
  );
}
