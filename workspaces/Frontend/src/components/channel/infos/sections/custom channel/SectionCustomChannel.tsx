import styles from "@/styles/profile/InfoCard.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import { Socket } from "socket.io-client";
import {
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditPassword from "./EditPassword";
import ResumeChannel from "./ResumeChannel";

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

  //const tempPassword = "yolo484*"; // [+] a remplacer par le password de channel, prop a ajouter
  const tempPassword = ""; // [+] a remplacer par le password de channel, prop a ajouter

  const [channelType, setChannelType] = useState<ChannelType>(channelAndUsersRelation.channel.type);
  const [password, setPassword] = useState<string>(tempPassword);
  const [notif, setNotif] = useState<string>("");

  const pack :{
    password:string,
    setPassword:Dispatch<SetStateAction<string>>,
    notif: string,
    setNotif: Dispatch<SetStateAction<string>>,
  } = {
    password: password,
    setPassword: setPassword,
    notif: notif,
    setNotif: setNotif,
  }

  const emitEditChannelType = (type:ChannelType, onSuccess: ()=>void, onFail: ()=>void) => {
    socket?.emit("editChannelType", 
      {
        channelId: channelAndUsersRelation.channel.id,
        type: type,
      },
      (rep:ReturnData) => {
        if (rep.success)
          onSuccess()
        else
          onFail()
      }
    )
  }

  const handleSwitchPublicPrivate = (type:ChannelType) => {

    emitEditChannelType(type,
        () => {
          if (channelType === "public" || channelType === "protected")
          setChannelType("private");
        else if (channelType === "private")
          setChannelType("public");
        },
        () => {
          setNotif("error switching public/private try later please");
        },
     )
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

    if (locked) {
      // [+] gestion de valider le password avant, doit etre diff de ""
      if (password !== "")

        setChannelType("protected");
      else {
        setNotif("Set a password before locking channel");
      }
    }
    else if (!locked) {
      setChannelType("public"); 
    }
  }
  
  const makeLockButton = (locked:boolean, onClick:(locked:boolean) => void, displayIt:boolean):JSX.Element => {

    const handleClick = () => {
      if ((channelType === "public" && locked) || (channelType === "protected" && !locked)) {
        console.log(`SectionCustomChannel => LockButtons => wanna set channel to ${locked ? "protected" : "public"}`); // checking
        onClick(locked)
      }
    };

    const getButtonStatus = ():boolean => {
       if ((locked && channelType === "protected" ) || (!locked && channelType !== "protected"))
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
      {/* //[+] A TESTER AVEC GRAND NOM DE ChANNEL */ }
      <p className={`${styles.tinyTitle} ${styles.marginTop}`}>{channelAndUsersRelation.channel.name}</p>
      <ResumeChannel type={channelType} />

      <p className={`${styles.tinyTitle} ${styles.marginTop}`}>Channel type</p>
          {makeChannelTypeButton("public", "Public", handleSwitchPublicPrivate)}
          {makeChannelTypeButton("private", "Private", handleSwitchPublicPrivate)}
      
      { (channelType === "public" || channelType === "protected") && 
        <p className={`${styles.tinyTitle} ${styles.marginTop}`}>Protected by Password</p>
      }
          {makeLockButton(false, handleSwitchLock, channelType !== "private")}
          {makeLockButton(true, handleSwitchLock, channelType !== "private")}
        
      { channelType !== "private" && 
        <EditPassword pack={pack} socket={socket} channelAndUsersRelation={channelAndUsersRelation}/>
      }

      {/* TEMPO checking */}
      <div style={{marginTop:"400px"}}>{`ChannelType = ${channelType}`}</div>

    </div>
  )
}
