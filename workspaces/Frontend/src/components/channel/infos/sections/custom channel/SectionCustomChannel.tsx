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
  relation: ChannelUsersRelation;
  myRelation: UserRelation;
  socket: Socket | undefined;
  setRelation: Dispatch<SetStateAction<ChannelUsersRelation>>;
};

export default function SectionCustomChannel({
  relation,
  setRelation,
  myRelation,
  socket,
}: Props) {

  //const [channelType, setChannelType] = useState<ChannelType>(relation.channel.type);
  //const [password, setPassword] = useState<string>(relation.channel.password);
  const [notif, setNotif] = useState<string>("");

  const pack :{
  relation: ChannelUsersRelation;
  setRelation: Dispatch<SetStateAction<ChannelUsersRelation>>,
   // password:string,
   // setPassword:Dispatch<SetStateAction<string>>,
   notif: string,
   setNotif: Dispatch<SetStateAction<string>>,
   // channelType: ChannelType,
  } = {
    relation: relation,
    setRelation: setRelation,
    notif: notif,
    setNotif: setNotif,
  }

  const emitEditChannelType = (type:ChannelType, onSuccess: ()=>void, onFail: ()=>void) => {
    socket?.emit("editChannelType", 
      {
        channelId: relation.channel.id,
        type: type,
      },
      (rep:ReturnData) => {
        console.log("emitEditChannelType => Rep =", rep); // checking
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
          if (pack.relation.channel.type === "public" || pack.relation.channel.type === "protected") {
            const modified = pack.relation;
            modified.channel.type = "private";
            pack.setRelation(modified);
          } else if (pack.relation.channel.type === "private") {
            const modified = pack.relation;
            modified.channel.type = "public"
            pack.setRelation(modified);
          }
        },
        () => {
          setNotif("error switching public/private try later please");
        },
     )
  };

  
  const makeChannelTypeButton = (type:ChannelType, name:string, onClick:(type:ChannelType) => void):JSX.Element => {
    const handleClick = () => {
      if ((type === "public" || "private") && type !== pack.relation.channel.type) {
          console.log("SectionCustomChannel => publicPrivButton => wanna set channel to " + type); // checking
          onClick(type)
        }
    };

    const getButtonStatus = ():boolean => {
      if (type === "public")
      return (pack.relation.channel.type === "public" || pack.relation.channel.type === "protected");
      else
      return (type === pack.relation.channel.type);
    }
    
    return (
      <div className={`${styles.button} ${getButtonStatus() ? styles.active : styles.inactive}`}
      onClick={handleClick}>
        {name}
      </div>
    );
  }
  
  
  const handleSwitchLock = (locked:boolean) => {

    if (locked) {
      if (pack.relation.channel.password !== "") {
      emitEditChannelType("protected",
        () => {
          const modified = pack.relation;
          modified.channel.type = "protected";
          pack.setRelation(modified);
          setNotif("");
        },
        () => {
          setNotif("error passing channel as protected try later please");
        },
     )
      } else {
        setNotif("Set a password before locking channel");
      }
    }
    else if (!locked) {
      emitEditChannelType("public",
        () => {
          const modified = pack.relation;
          modified.channel.type = "public";
          pack.setRelation(modified);
          setNotif("");
        },
        () => {
          setNotif("error passing channel as public try later please");
        },
     )
    }
  }
  
  const makeLockButton = (locked:boolean, onClick:(locked:boolean) => void, displayIt:boolean):JSX.Element => {

    const handleClick = () => {
      if ((pack.relation.channel.type === "public" && locked) || (pack.relation.channel.type === "protected" && !locked)) {
        console.log(`SectionCustomChannel => LockButtons => wanna set channel to ${locked ? "protected" : "public"}`); // checking
        onClick(locked)
      }
    };

    const getButtonStatus = ():boolean => {
       if ((locked && pack.relation.channel.type === "protected" ) || (!locked && pack.relation.channel.type !== "protected"))
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
      <p className={`${styles.tinyTitle} ${styles.marginTop}`}>{relation.channel.name}</p>
      <ResumeChannel type={pack.relation.channel.type} />

      <p className={`${styles.tinyTitle} ${styles.marginTop}`}>Channel type</p>
          {makeChannelTypeButton("public", "Public", handleSwitchPublicPrivate)}
          {makeChannelTypeButton("private", "Private", handleSwitchPublicPrivate)}
      
      { (pack.relation.channel.type === "public" || pack.relation.channel.type === "protected") && 
        <p className={`${styles.tinyTitle} ${styles.marginTop}`}>Protected by Password</p>
      }
          {makeLockButton(false, handleSwitchLock, pack.relation.channel.type !== "private")}
          {makeLockButton(true, handleSwitchLock, pack.relation.channel.type !== "private")}
        
      { pack.relation.channel.type !== "private" && 
        <EditPassword pack={pack} socket={socket} channelAndUsersRelation={relation}/>
      }
    </div>
  )
}
