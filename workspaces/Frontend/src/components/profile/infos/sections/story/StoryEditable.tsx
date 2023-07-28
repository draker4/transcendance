import { checkStory } from "@/lib/profile/edit/checkStory";
import styles from "@/styles/profile/InfoCard.module.css";
import { ChangeEvent, useState } from "react";
import { filterBadWords } from "@/lib/bad-words/filterBadWords";
import Profile_Service from "@/services/Profile.service";

type Props = {
  profile: Profile;
  token: string;
};

export default function StoryEditable({ profile, token }: Props) {
  const profileService = new Profile_Service(token);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [story, setStory] = useState<string>(
    profile.story === null ? "" : profile.story
  );
  const [editedStory, setEditedStory] = useState<string>(story);
  const [notif, setNotif] = useState<string>("");
  const [prof, setProf] = useState<Profile>(profile);

  const handleClickEdit = () => {
    setEditMode(true);
  };

  const handleEditedStoryChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setEditedStory(event.target.value);
  };

  const handleSubmitStory = async (e: any) => {
    e.preventDefault();

    const submitedStory = e.target.story.value;

    if (typeof submitedStory === "string") {
      if (submitedStory === story) {
        setEditMode(false);
        return;
      }

      const checkedStory = checkStory(submitedStory);
      setNotif(checkedStory);

      if (checkedStory.length == 0) {
        const rep: Rep = await profileService.editUser({
          story: submitedStory,
        });

        if (rep.success) {
          const updatedProfile = profile;
          updatedProfile.story = filterBadWords(submitedStory);

          setProf(updatedProfile);
          setStory(updatedProfile.story);
          setEditMode(false);
        } else {
          setNotif(rep.message);
          setEditMode(false);
        }
      }
    }
  };

  return (
    <div>
      <p className={styles.tinyTitle}>Crunchy story</p>

      {!editMode && story !== "" && (
        <div
          className={styles.story + " " + styles.display}
          onClick={handleClickEdit}
        >
          <textarea value={story} rows={6} readOnly />
        </div>
      )}

      {!editMode && story === "" && (
        <div onClick={handleClickEdit}>
          <p className={styles.story + " " + styles.placeholder}>
            {" "}
            set here your crunchy story{" "}
          </p>
        </div>
      )}

      {editMode && (
        <div>
          <form onSubmit={handleSubmitStory}>
            <div className={styles.story}>
              <textarea
                name="story"
                value={editedStory}
                placeholder="set here your crunchy story"
                onChange={handleEditedStoryChange}
                autoFocus
                rows={6}
                maxLength={350}
                spellCheck="false"
                id="storyInput"
              />
            </div>
            <div className={styles.notif}>{notif}</div>
            <button className={styles.button_type1} type="submit">
              confirm changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
