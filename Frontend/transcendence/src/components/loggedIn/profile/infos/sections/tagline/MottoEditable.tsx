import styles from "@/styles/loggedIn/profile/InfoCard.module.css";
import { ChangeEvent, useState } from "react";
import { checkMotto } from "@/lib/profile/edit/checkMotto";
import submitMotto from "@/lib/profile/edit/submitMotto";
import { filterBadWords } from "@/lib/bad-words/filterBadWords";
import Profile_Service from "@/services/Profile.service";

type Props = {
  profile: Profile;
  token: string;
};

export default function MottoEditable({ profile, token }: Props) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [motto, setMotto] = useState<string>(
    profile.motto === null ? "" : profile.motto
  );
  const [editedMotto, setEditedMotto] = useState<string>(motto);
  const [notif, setNotif] = useState<string>("");
  const [prof, setProf] = useState<Profile>(profile);

  const handleClickEdit = () => {
    setEditMode(true);
  };

  const handleEditedMottoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedMotto(event.target.value);
  };

  const handleSubmitMotto = async (e: any) => {
    e.preventDefault();
    const submitedMotto = e.target.motto.value;

    if (typeof submitedMotto === "string") {
      if (submitedMotto === motto) {
        setEditMode(false);
        return;
      }

      const checkedMotto = checkMotto(submitedMotto);
      setNotif(checkedMotto);

      if (checkedMotto.length === 0) {
        const response = await submitMotto(submitedMotto, token);

        if (response === "") {
          const updatedProfile = profile;
          updatedProfile.motto = filterBadWords(submitedMotto);

          setProf(updatedProfile);
          setMotto(updatedProfile.motto);
          setEditMode(false);
        }
      }
    }
  };

  const handleStupidButton = async () => {
    const profileData = new Profile_Service(token);
    const freshProfile = await profileData.getProfileByLogin(profile.login);
    console.log("freshProfile motto : ", freshProfile.motto);
  };

  return (
    <div>
      <p className={styles.tinyTitle}>Crunchy motto</p>

      {!editMode && motto !== "" && (
        <div onClick={handleClickEdit}>
          <p className={styles.motto}> {motto} </p>
          <button onClick={handleClickEdit}>Edit</button>
        </div>
      )}

      {!editMode && motto === "" && (
        <div onClick={handleClickEdit}>
          <p className={styles.motto + " " + styles.placeholder}>
            {" "}
            set here your crunchy motto{" "}
          </p>
          <button onClick={handleClickEdit}>Edit</button>
        </div>
      )}

      {editMode && (
        <div>
          <form onSubmit={handleSubmitMotto}>
            <p className={styles.motto}>
              {" "}
              <input
                type="text"
                name="motto"
                value={editedMotto}
                placeholder="set here your crunchy motto"
                onChange={handleEditedMottoChange}
                autoFocus
                id="mottoInput"
              />
            </p>
            <div className={styles.notif}>{notif}</div>

            <button type="submit">confirm changes</button>
          </form>
        </div>
      )}

      <br />
      <br />
      <button onClick={handleStupidButton}>stupid</button>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
