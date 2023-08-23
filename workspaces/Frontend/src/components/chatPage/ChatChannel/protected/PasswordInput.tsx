import styles from "@/styles/profile/InfoCard.module.css";
import { ChangeEvent, ReactNode, useState } from "react";
import { Socket } from "socket.io-client";

type Props = {
  display: Channel & {needPassword: boolean};
  icon: ReactNode;
  channel: Channel;
  myself: Profile & { avatar: Avatar };
  socket: Socket | undefined;
  status: Map<string, string>;
}

export default function PasswordInput({display, icon, channel, myself, socket, status}: Props) {

  const [editMode, setEditMode] = useState<boolean>(false);
  // const [password, setPassword] = useState<string>("");
  const [editedPassword, setEditedPassword] = useState<string>("");

  const handleEditedPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedPassword(event.target.value);
  };

  const handleClickEdit = () => {
    setEditMode(true);
  };
  
   // [+] oblige le type any?
   const handleSubmitPassword = async (e: any) => {
    e.preventDefault();


    setEditMode(false);
  }


  if (!editMode) {
    return ( 
    <div onClick={handleClickEdit}>
      <p className={styles.password + " " + styles.placeholder}>
        {" "}enter password{" "}
      </p>
    </div>);


  } else {
    return (
    <>
      <form onSubmit={handleSubmitPassword}>
          <p className={styles.password}>
            {" "}
            <input
              type="text"
              name="password"
              value={editedPassword}
              placeholder="enter password"
              onChange={handleEditedPasswordChange}
              autoFocus
              id="passwordInput"
            />
          </p>

          <button className={styles.button_type1} type="submit">
            confirm changes
          </button>
        </form>
    </>);
  }
  

}

