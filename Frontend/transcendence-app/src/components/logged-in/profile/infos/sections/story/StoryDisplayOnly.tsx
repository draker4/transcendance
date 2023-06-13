import Profile from "@/services/Profile.service";
import styles from "@/styles/profile/InfoCard.module.css";
import { useState } from "react";

type Props = {
	profile: Profile;
}

export default function StoryDisplayOnly({profile} : Props) {

	const [story, setStory] = useState<string>(profile.story === null ? "" : profile.story);

	return (
		<>
			{ story !== "" && <p className={styles.tinyTitle}>Crunchy story</p>}
			{ story !== "" && <p className={styles.story}> {story} </p> }
		</>
	)
}
