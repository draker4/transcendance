import styles from "@/styles/profile/InfoCard.module.css";
import MottoEditable from "./tagline/MottoEditable";
import StoryEditable from "./story/StoryEditable";
import ConfigAuthEditable from "./configAuth/ConfigAuthEditable";
import { Dispatch, SetStateAction } from "react";

type Props = {
  profile: Profile;
  setLogin: Dispatch<SetStateAction<string>>;
};

export default function SectionCustom({ profile, setLogin }: Props) {
  return (
    <div className={styles.sections}>
      <MottoEditable profile={profile} />
      <StoryEditable profile={profile} />
      <ConfigAuthEditable profile={profile} setLogin={setLogin} />
    </div>
  );
}
