import styles from "@/styles/profile/InfoCard.module.css";
import { useState } from "react";
import { Socket } from "socket.io-client";
import {
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditPassword from "./EditPassword";

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
      // [+] gestion vers backend + attente reponse

      if (channelType === "public" || channelType === "protected")
        setChannelType("private");
      else if (channelType === "private")
        setChannelType("public");
  };

  
  const makeChannelTypeButton = (type:ChannelType, name:string, onClick:(type:ChannelType) => void):JSX.Element => {
    const handleClick = () => {
      if ((type === "public" || "private") && type !== channelType) {
          console.log("SectionCustomChannel => publicPrivButton => wanna set channel to " + type); // checking
          onClick(type)
        }
    };

    const getButtonStatus = ():boolean => {
      if (type === "public")
      return (channelType === "public" || channelType === "protected");
      else
      return (type === channelType);
    }
    
    return (
      <div className={`${styles.button} ${getButtonStatus() ? styles.active : styles.inactive}`}
      onClick={handleClick}>
        {name}
      </div>
    );
  }
  
  
  const handleSwitchLock = (locked:boolean) => {

    // [+] gestion vers backend + attente rep

    // [+] pas oublier si type === protected && password === "" revient a type === public

    /* */
    if (locked) {
      // [+] gestion de valider le password avant, doit etre diff de ""
        // setChannelType("protected");
    }
    else if (!locked) {
      setChannelType("public"); 
    }
    /* */
  }
  
  const makeLockButton = (locked:boolean, onClick:(locked:boolean) => void, displayIt:boolean):JSX.Element => {

    const handleClick = () => {
      if ((channelType === "public" && locked) || (channelType === "protected" && !locked)) {
        console.log(`SectionCustomChannel => LockButtons => wanna set channel to ${locked ? "protected" : "public"}`); // checking
        onClick(locked)
      }
    };

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
      
      { (channelType === "public" || channelType === "protected") && 
        <p className={`${styles.tinyTitle} ${styles.marginTop}`}>Protected by Password</p>
      }
          {makeLockButton(false, handleSwitchLock, channelType !== "private")}
          {makeLockButton(true, handleSwitchLock, channelType !== "private")}
        
      { channelType === "protected" && 
        <EditPassword password={password} setPassword={setPassword}/>
      }

      {/* TEMPO checking */}
      <div style={{marginTop:"400px"}}>{`ChannelType = ${channelType}`}</div>

    </div>
  )
}
