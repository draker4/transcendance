import Profile from "@/services/Profile.service";
import styles from "@/styles/profile/InfoCard.module.css";
import MottoEditable from "./motto/MottoEditable";
import StoryEditable from "./story/StoryEditable";

type Props = {
	profile: Profile;
	token: string;
  }


export default function SectionCustom({profile, token} : Props) {

	return (

	<div className={styles.sections}>
		<MottoEditable profile={profile} token={token} />
		<StoryEditable profile={profile} token={token} />
	</div>

	)
}
