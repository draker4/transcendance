import styles from "@/styles/profile/Profile.module.css";
import InfoCard from "./infos/InfoCard";
import { cookies } from "next/dist/client/components/headers";
import ProfileFooter from "./infos/ProfileFooter";

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
	  {unwrappedToken !== "" && !isOwner &&(
		<ProfileFooter profile={profile}/>
      )}
    </div>
  );
}
