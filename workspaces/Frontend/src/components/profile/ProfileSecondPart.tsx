import styles from "@/styles/profile/Profile.module.css";
import InfoCard from "./infos/InfoCard";
import ProfileFooter from "./infos/ProfileFooter";
import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";

type Props = {
  profile: Profile;
  isOwner: boolean;
  setLogin: Dispatch<SetStateAction<string>>;
  socket: Socket | undefined;
};

export default function ProfileSecondPart({ profile, isOwner, setLogin, socket }: Props) {

  return (
    <div className={styles.both + " " + styles.second}>
      <InfoCard profile={profile} isOwner={isOwner} setLogin={setLogin} socket={socket}/>
		  <ProfileFooter profile={profile}/>
    </div>
  );
}
