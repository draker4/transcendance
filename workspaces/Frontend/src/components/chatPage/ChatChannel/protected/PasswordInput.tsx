import Channel_Service from "@/services/Channel.service";
import styles from "@/styles/chatPage/ChatChannel/PasswordInput.module.css";
import { EditChannelRelation } from "@/types/Channel-linked/EditChannelRelation";
import { ChangeEvent, ReactNode, useState } from "react";
import { Socket } from "socket.io-client";

type Props = {
  channel: Channel;
  myself: Profile & { avatar: Avatar };
  socket: Socket | undefined;
  openDisplay: (display: Display) => void;
}

export default function PasswordInput({channel, myself, socket, openDisplay}: Props) {

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedPassword, setEditedPassword] = useState<string>("");
  const [notif, setNotif] = useState<string>("");

  const handleEditedPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedPassword(event.target.value);
  };

  const handleClickEdit = () => {
    setEditMode(true);
  };

  const afterVerifyPassword = async () => {

    try {
      const newRelation:EditChannelRelation = {
        channelId: channel.id,
        userId: myself.id,
        senderId: myself.id,
        newRelation: {
          joined: true,
          invited:false,
        }
      }

      const channelService = new Channel_Service(undefined);
      const rep = await channelService.editRelation(channel.id, myself.id, newRelation.newRelation);
      console.log("verifyPassword => editRelation (API) => REP : ", rep); // checking

      if (rep.success) {
          socket?.emit("editRelation", newRelation, (repNotif:ReturnData) => {
            console.log("verifyPassword => editRelation => editRelation (WebSocket) => REP : ", repNotif); // checking
            if (repNotif.success) {
              openDisplay({...channel, needPassword:false })
            } else {
              setNotif(repNotif.message ? repNotif.message : "An error occured, please try again later");
            }
          });
      } else { 
        console.log("afterVerifyPassword => error (object) : ", rep.error); // checking
        throw new Error(rep.message); 
    }


    } catch(error:any) {
      setNotif(error.message ? error.message : "An error occured, please try again later");
    }
  }
  
   // [+] oblige le type any?
   // [+] réflechir à cette gestion du password, devrait pas etre envoyé avec les infos de channel
   const handleVerifyPassword = async (event: any) => {
    event.preventDefault();

    try {
      const submitedPassword:string = event.target.password.value;

      socket?.emit("verifyChannelPassword", 
        {
          channelId: channel.id,
          password: submitedPassword,
        }, 
        (rep:ReturnData) => {
          console.log("verifyPassword => REP : ", rep); // checking
          if (rep.success) {
            setNotif("");
            afterVerifyPassword();
          } else {
            // [!] Throwing error in this callback won't be caught
            if (rep.message && rep.message !== "")
              setNotif(rep.message);
            else
              setNotif("An error occured, please try again later");
          }
        })
    } catch(error:any) {
      setNotif(error.message ? error.message : "An error occured, please try again later");
    }
    setEditMode(false);
  }


  if (!editMode) {
    return ( 
    <div className={styles.card}>
      <p className={styles.notif}>{notif}</p>
      <div onClick={handleClickEdit}>
        <p className={styles.password + " " + styles.placeholder}>
          {" "}enter password{" "}
        </p>
      </div>
    </div>);

  } else {
    return (
    <div className={styles.card}>
      <p className={styles.notif}>{notif}</p> 
      <form onSubmit={handleVerifyPassword} className={styles.form}>
          <p className={styles.password}>
            {" "}
            <input
              type="text"
              name="password"
              maxLength={20}
              value={editedPassword}
              placeholder="enter password"
              onChange={handleEditedPasswordChange}
              autoFocus
              id="passwordInput"
            />
          </p>
          <button className={styles.button_type1} type="submit">
            submit
          </button>
        </form>
    </div>);
  }
  

}

