import styles from "@/styles/profile/Profile.module.css";
import InfoCard from "./infos/InfoCard";
import { cookies } from "next/dist/client/components/headers";
import ProfileFooter from "./infos/ProfileFooter";
import { Dispatch, SetStateAction } from "react";

type Props = {
  profile: Profile;
  isOwner: boolean;
  setLogin: Dispatch<SetStateAction<string>>;
};

export default function ProfileSecondPart({ profile, isOwner, setLogin }: Props) {

  return (
    <div className={styles.both + " " + styles.second}>
      <InfoCard profile={profile} isOwner={isOwner} setLogin={setLogin} />
		  <ProfileFooter profile={profile}/>
    </div>
  );
}
