import styles from "@/styles/profile/InfoCard.module.css";
import MottoEditable from "./tagline/MottoEditable";
import StoryEditable from "./story/StoryEditable";
import ConfigAuthEditable from "./configAuth/ConfigAuthEditable";
import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";

type Props = {
  profile: Profile;
  setLogin: Dispatch<SetStateAction<string>>;
  socket: Socket | undefined;
};

export default function SectionCustom({ profile, setLogin, socket }: Props) {
  return (
    <div className={styles.sections}>
      <MottoEditable profile={profile} />
      <StoryEditable profile={profile} />
      <ConfigAuthEditable profile={profile} setLogin={setLogin} socket={socket}/>
    </div>
  );
}
