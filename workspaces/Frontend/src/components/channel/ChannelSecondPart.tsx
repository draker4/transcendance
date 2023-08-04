import styles from "@/styles/profile/Profile.module.css";
import { cookies } from "next/headers";
import ChannelInfoCard from "./infos/ChannelInfoCard";

type Props = {
	channelAndUsersRelation: ChannelUsersRelation;
	myRelation: UserRelation;
  };

export default function ChannelSecondPart({ channelAndUsersRelation, myRelation }: Props) {

	const token = cookies().get("crunchy-token")?.value;

	// [+][!] ameliorer le composant d'erreure
    if (!token)
		return (<div> E R R O R ... try refresh and reconnect</div>);

  return (
	<div className={styles.both + " " + styles.second}>
		<ChannelInfoCard token={token} channelAndUsersRelation={channelAndUsersRelation} myRelation={myRelation} />
	</div>
  )
}
