import styles from "@/styles/profile/InfoCard.module.css";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

type Props = {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>
}

export default function EditPassword({password, setPassword}:Props) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedPassword, setEditedPassword] = useState<string>(password);
  const [notif, setNotif] = useState<string>("");

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

  if (!editMode && password === "") {
    return (
      <>
      <p className={`${styles.tinyTitle} ${styles.marginTop}`}>Password</p>
      <div onClick={handleClickEdit}>
        <p className={styles.password + " " + styles.placeholder}>
          {" "}set channel password{" "}
        </p>
      </div>
      </>
    );
  } else if (!editMode && password !== "") {
    return (
      <>
        <p className={`${styles.tinyTitle} ${styles.marginTop}`}>Password</p>
        <div onClick={handleClickEdit}>
          <p className={styles.password}> {password} </p>
        </div>
      </>
    );
  } else {
    return (
      <>
        <p className={`${styles.tinyTitle} ${styles.marginTop}`}>Password</p>
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
          <div className={styles.notif}>{notif}</div>

          <button className={styles.button_type1} type="submit">
            confirm changes
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <p className={`${styles.tinyTitle} ${styles.marginTop}`}>Password</p>
      <p>{password}</p>
    </>
  )
}
