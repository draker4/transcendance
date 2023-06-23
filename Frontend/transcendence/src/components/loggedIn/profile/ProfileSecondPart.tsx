import styles from "@/styles/loggedIn/profile/Profile.module.css";
import InfoCard from "./infos/InfoCard";
import Profile from "@/services/Profile.service";
import { cookies } from "next/dist/client/components/headers";

type Props = {
  profile: Profile;
  isOwner: boolean;
};

export default function ProfileSecondPart({ profile, isOwner }: Props) {
  const token = cookies().get("crunchy-token")?.value;
  const unwrappedToken: string = typeof token === "string" ? token : "";

  return (
    <div className={styles.both + " " + styles.second}>
      {unwrappedToken !== "" && (
        <InfoCard profile={profile} token={unwrappedToken} isOwner={isOwner} />
      )}
    </div>
  );
}
