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

export default function MessageItem( {groupedMessages} : Props) {

    const mappingMessages = groupedMessages.messages.map((msg, index) => (
        <p key={index}>{msg.content}</p>
    ));

  return (
    <div>
         {/* <AvatarUser
        avatar={message.sender.avatar}
        borderSize="2px"
        borderColor={message.sender.avatar.borderColor}
        backgroundColor={message.sender.avatar.backgroundColor}
      /> */}
      <h2>{groupedMessages.sender.login}</h2>
      <h6>{`at ${groupedMessages.date.getSeconds()}`}</h6>
      {mappingMessages}
    </div>
  )

    // return (
    //     <div className={styles.msgItem}></div>

    // )
}
