import styles from "@/styles/profile/InfoCard.module.css";
import MottoEditable from "./tagline/MottoEditable";
import StoryEditable from "./story/StoryEditable";
import ConfigAuthEditable from "./configAuth/ConfigAuthEditable";

type Props = {
  profile: Profile;
  token: string;
};

export default function SectionCustom({ profile, token }: Props) {
  return (
    <div className={styles.sections}>
      <MottoEditable profile={profile} token={token} />
      <StoryEditable profile={profile} token={token} />
      <ConfigAuthEditable profile={profile} />
    </div>
  );
}
