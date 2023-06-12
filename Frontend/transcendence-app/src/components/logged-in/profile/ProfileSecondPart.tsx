import styles from "@/styles/profile/Profile.module.css"
import InfoCard from "./infos/InfoCard"
import Profile from "@/services/Profile.service"
import { cookies } from "next/dist/client/components/headers";

type Props = {
    profile: Profile;
}

export default function ProfileSecondPart({profile} : Props) {
	const token = cookies().get("crunchy-token")?.value;

  return (
	<div className={styles.both + ' ' + styles.second}>
		<InfoCard profile={profile} token={token}/>
	</div>
  )
}
