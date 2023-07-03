import styles from "@/styles/loggedIn/profile/InfoCard.module.css";
import { useState } from "react";

type Props = {
  profile: Profile;
};

export default function StoryDisplayOnly({ profile }: Props) {
  // [?] pas besoin d'un useState pour le moment je pense
  const [story, setStory] = useState<string>(
    profile.story === null ? "" : profile.story
  );

  return (
    <>
      {story !== "" && <p className={styles.tinyTitle}>Crunchy story</p>}
      {story !== "" && (
        <div className={styles.story}>
          <textarea value={story} rows={6} readOnly />
        </div>
      )}
    </>
  );
}
