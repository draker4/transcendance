import styles from "@/styles/chatPage/privateMsg/ChatPrivateMsg.module.css";
import AvatarUser from "@/components/loggedIn/avatarUser/AvatarUser";

type GroupedPrivateMsgType = {
  sender: Pongie;
  date: Date;
  messages: PrivateMsgType[];
};

type Props = {
  groupedMessages: GroupedPrivateMsgType;
};

export default function MessageItem({ groupedMessages }: Props) {
  const mappingMessages = groupedMessages.messages.map((msg, index) => (
    <p key={index}>{msg.content}</p>
  ));

  return (
    <div className={styles.msgItem}>
      {/* Avatar Side */}
      <div className={styles.avatarSide}>
        <div className={styles.avatarSlot}>
          <AvatarUser
            avatar={groupedMessages.sender.avatar}
            borderSize="3px"
            borderColor={groupedMessages.sender.avatar.borderColor}
            backgroundColor={groupedMessages.sender.avatar.backgroundColor}
          />
        </div>
      </div>

      {/* Text Side */}
      <div className={styles.textSide}>
        {/* Header */}
        <div className={styles.tsheader}>
          <div className={styles.name} style={{color: groupedMessages.sender.avatar.borderColor}}>
            {groupedMessages.sender.login}
          </div>
          <div className={styles.date}>
            {`at ${groupedMessages.date.getSeconds()}`}
          </div>
        </div>
        {/* Content */}
        <div className={styles.content}>{mappingMessages}</div>
      </div>
    </div>
  );
}
