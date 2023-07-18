import styles from "@/styles/chatPage/ChatChannel/ChatChannel.module.css"
import MessageItem from "./MessageItem";
import { useEffect, useState } from "react";

type Props = {
  messages: Message[];
};

type GroupedMsgType = {
  user: User;
  date: Date;
  messages: Message[];
};

export default function MessageBoard({ messages }: Props) {
  const [groupedMessages, setGroupedMessages] = useState<
    GroupedMsgType[]
  >([]);

  // [!] peu etre un peu lourd de join tous les messages à chaque new message ?
  useEffect(() => {
    joiningMessages();
    // joiningMessages() won't change, no need to put in dependencies :
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const isSameSender = (senderA: User, senderB: User) => {
    return senderA.id === senderB.id;
  };

  const isWithinTwoMinutes = (dateA: Date, dateB: Date) => {

    if (!(dateA instanceof Date) || !(dateB instanceof Date)) {
      console.log("invalid date object");
      console.log("dateA : ", dateA);
      console.log("dateB : ", dateB);
      return false;
    }

    const diffMilliseconds = Math.abs(dateA.getTime() - dateB.getTime());
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    return diffMinutes < 2;
  };

  
  const joiningMessages = () => {
    const join = [];

    for (let i = 0; i < messages.length; i++) {
      const currentMsg = messages[i];
      const lastGroup = join[join.length - 1];

      if (
        lastGroup &&
        isSameSender(currentMsg.sender, lastGroup.user) &&
        isWithinTwoMinutes(currentMsg.date, lastGroup.date)
      ) {
        lastGroup.messages.push(currentMsg);
      } else {
        join.push({
          user: currentMsg.sender,
          date: currentMsg.date,
          messages: [currentMsg],
        });
      }
    }

    setGroupedMessages(join);
  };

  return (
    <div className={styles.msgBoard}>
      {groupedMessages.map((group, index) => (
        <MessageItem key={index} groupedMessages={group} />
      ))}
    </div>
  );
}
