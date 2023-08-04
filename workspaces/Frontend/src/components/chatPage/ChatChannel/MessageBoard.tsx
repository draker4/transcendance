import styles from "@/styles/chatPage/ChatChannel/ChatChannel.module.css"
import MessageItem from "./MessageItem";
import { useEffect, useState } from "react";

type Props = {
  messages: Message[];
  channel: Channel;
};

type GroupedMsgType = {
  user: User;
  date: Date;
  messages: Message[];
  isServerNotif: boolean;
};

export default function MessageBoard({ messages, channel }: Props) {
  const [groupedMessages, setGroupedMessages] = useState<
    GroupedMsgType[]
  >([]);

  useEffect(() => {
    joiningMessages();
  }, [messages]);

  const isSameSender = (senderA: User, senderB: User) => {
    if (!senderA || !senderB)
      return false;
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

  const placeholder:string = channel.type === "privateMsg" ? "Feel free to say hello :D !" : " The channel is empty, start here a new passionating topic !";
  
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
          isServerNotif: currentMsg.isServerNotif,
        });
      }
    }

    setGroupedMessages(join);
  };

  return (
    <div className={styles.msgBoard}>
      {messages.length > 0 && groupedMessages.map((group, index) => (
        <MessageItem key={index} groupedMessages={group} />
      ))}
	  {messages.length === 0 && <p className={styles.placeholder}>{placeholder}</p>}
    </div>
  );
}
