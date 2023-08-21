import styles from "@/styles/profile/InfoCard.module.css";
import { ChannelType } from "@/types/Channel";
import { useState } from "react";
import { Socket } from "socket.io-client";
import {
  faLock,
  faLockOpen,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  channelAndUsersRelation: ChannelUsersRelation;
  myRelation: UserRelation;
  socket: Socket | undefined;
};

export default function SectionCustomChannel({
  channelAndUsersRelation,
  myRelation,
  socket,
}: Props) {

  const tempPassword = "yolo484*"; // [+] a remplacer par le password de channel, prop a ajouter

  const [channelType, setChannelType] = useState<ChannelType>(channelAndUsersRelation.channel.type);
  const [password, setPassword] = useState<string>(tempPassword);


  const handleSwitchPublicPrivate = (type:ChannelType) => {
    if ((type === "public" || "private") && type !== channelType) {
      console.log("SectionCustomChannel => button => wanna set channel to " + type); // checking
      // [+] gestion vers backend + attente reponse

      if (channelType === "public")
        setChannelType("private");
      else if (channelType === "private")
        setChannelType("public");
    }
  };

  const handleSwitchLock = (locked:boolean) => {
    
    // [+] gestion vers backend + attente rep

    // [+] pas oublier si type === protected && password === "" revient a type === public

    if (locked)
      setChannelType("public");
    else if (!locked)
      setChannelType("protected"); // [+] gestion de valider le password avant, doit etre diff de ""

  }

  const makeChannelTypeButton = (type:ChannelType, name:string, onClick:(type:ChannelType) => void):JSX.Element => {
    const handleClick = () => {onClick(type)};

    const getButtonStatus = ():boolean => {
        return (type === channelType);
    }

    return (
      <div className={`${styles.button} ${getButtonStatus() ? styles.active : styles.inactive}`}
           onClick={handleClick}>
        {name}
      </div>
    );
  }

  

  const makeLockButton = (locked:boolean, onClick:(locked:boolean, ) => void, displayIt:boolean):JSX.Element => {

    const handleClick = () => {onClick(locked)};

    const getButtonStatus = ():boolean => {
       if (locked && channelType === "protected" || !locked && channelType !== "protected")
          return true;
       return false;
     }

    if (!displayIt) {return (<></>);}

    return (
      <div className={`${styles.button} ${getButtonStatus() ? styles.active : styles.inactive}`}
           onClick={handleClick}>
        {<FontAwesomeIcon icon={locked ? faLock : faLockOpen}/>}
      </div>
    );
  }






  return (
    <div className={styles.sections}>
      <p className={styles.tinyTitle}>Channel type</p>
          {makeChannelTypeButton("public", "Public", handleSwitchPublicPrivate)}
          {makeChannelTypeButton("private", "Private", handleSwitchPublicPrivate)}
      
      { channelType === "public" && 
        <p className={`${styles.tinyTitle} ${styles.marginTop}`}>Protected by Password</p>
      }
          {makeLockButton(false, handleSwitchLock, channelType === "public")}
          {makeLockButton(true, handleSwitchLock, channelType === "public")}
        
      { channelType === "protected" && 
        <p className={`${styles.tinyTitle} ${styles.marginTop}`}>Password</p>
      }
      {password}

    </div>
  )
}
