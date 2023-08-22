import styles from "@/styles/profile/InfoCard.module.css";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Socket } from "socket.io-client";

type Props = {
  pack : {
    password:string,
    setPassword:Dispatch<SetStateAction<string>>,
    notif: string,
    setNotif: Dispatch<SetStateAction<string>>,
  }
  socket:Socket | undefined,
  channelAndUsersRelation: ChannelUsersRelation,
}

export default function EditPassword({pack, socket, channelAndUsersRelation}:Props) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedPassword, setEditedPassword] = useState<string>(pack.password);

  const handleEditedPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedPassword(event.target.value);
  };

  const handleClickEdit = () => {
    setEditMode(true);
  };

  // [+] oblige le type any?
  const handleSubmitPassword = async (e: any) => {
    e.preventDefault();
    const submitedPassword:string = e.target.password.value;

    if (submitedPassword === pack.password) {
      pack.setNotif("");
    } else if (submitedPassword.length > 20) {
        pack.setNotif("Your password can't exceed 20 characters");
    } else {
        socket?.emit(
          "editChannelPassword", 
        {
          channelId: channelAndUsersRelation.channel.id,
          password: submitedPassword,
        }, 
        (rep:ReturnData) => {
          console.log("handleSubmitPassword => REP : ", rep); // checking
          if (rep.success) {
            pack.setPassword(submitedPassword);
            pack.setNotif("");
          } else {
            pack.setNotif(rep.message ? rep.message : "An error occured, please try again later");
          }
        });
    }
      setEditMode(false);
  }

  if (!editMode && pack.password === "") {
    return (
      <>
      <p className={`${styles.tinyTitle} ${styles.marginTop}`}>Password</p>
      {pack.notif !== "" && <p className={`${styles.notif} ${styles.noMargin}`}>{pack.notif}</p>}
      <div onClick={handleClickEdit}>
        <p className={styles.password + " " + styles.placeholder}>
          {" "}set channel password{" "}
        </p>
      </div>
      </>
    );
  } else if (!editMode && pack.password !== "") {
    return (
      <>
        <p className={`${styles.tinyTitle} ${styles.marginTop}`}>Password</p>
        {pack.notif !== "" && <p className={`${styles.notif} ${styles.noMargin}`}>{pack.notif}</p>}
        <div onClick={handleClickEdit}>
          <p className={styles.password}> {pack.password} </p>
        </div>
      </>
    );
  } else {
    return (
      <>
        <p className={`${styles.tinyTitle} ${styles.marginTop}`}>Password</p>
        {pack.notif !== "" && <p className={`${styles.notif} ${styles.noMargin}`}>{pack.notif}</p>}
        <form onSubmit={handleSubmitPassword}>
          <p className={styles.password}>
            {" "}
            <input
              type="text"
              name="password"
              value={editedPassword}
              placeholder="set channel password"
              onChange={handleEditedPasswordChange}
              autoFocus
              id="passwordInput"
            />
          </p>

          <button className={styles.button_type1} type="submit">
            confirm changes
          </button>
        </form>
      </>
    );
  }
}
