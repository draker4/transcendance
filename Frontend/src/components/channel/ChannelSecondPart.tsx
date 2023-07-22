import styles from "@/styles/profile/Profile.module.css";
import ChannelInfoCard from "./infos/ChannelInfoCard";

type Props = {
	channelAndUsersRelation: ChannelUsersRelation;
	myRelation: UserRelation;
  };

export default function ChannelSecondPart({ channelAndUsersRelation, myRelation }: Props) {

  return (
	<div className={styles.both + " " + styles.second}>
		<ChannelInfoCard channelAndUsersRelation={channelAndUsersRelation} myRelation={myRelation} />
	</div>
  )
}
