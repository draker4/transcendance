import styles from "@/styles/profile/Profile.module.css";
import ChannelInfoCard from "./infos/ChannelInfoCard";
import { Socket } from "socket.io-client";

type Props = {
	channelAndUsersRelation: ChannelUsersRelation;
	myRelation: UserRelation;
	socket: Socket | undefined;
  };

export default function ChannelSecondPart({ channelAndUsersRelation, myRelation, socket }: Props) {

  return (
	<div className={styles.both + " " + styles.second}>
		<ChannelInfoCard channelAndUsersRelation={channelAndUsersRelation} myRelation={myRelation} socket={socket}  />
	</div>
  );
}