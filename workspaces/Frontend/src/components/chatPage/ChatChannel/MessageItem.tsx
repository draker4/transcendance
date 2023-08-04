import styles from "@/styles/chatPage/ChatChannel/ChatChannel.module.css"
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

  // if (!groupedMessages.user.avatar)
  //   return ;

  return (
    <div className={styles.msgItem}>
      {/* Avatar Side */}
      {
        !groupedMessages.isServerNotif &&
        <div className={styles.avatarSide}>
          <div className={styles.avatarSlot}>
            <AvatarUser
              avatar={groupedMessages.user.avatar}
              borderSize="3px"
              borderColor={groupedMessages.user.avatar.borderColor}
              backgroundColor={groupedMessages.user.avatar.backgroundColor}
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
            style={{ color: groupedMessages.isServerNotif ? "var(--accent1)" : groupedMessages.user.avatar.borderColor }}
          >
            {groupedMessages.isServerNotif ? "Server" : groupedMessages.user.login}
          </div>
          <div className={styles.date}>
            {formatedDate}
          </div>
        </div>
        {/* Content */}
        <div className={styles.content}>
			{mappingMessages}
		</div>
      </div>
    </div>
  );
}
