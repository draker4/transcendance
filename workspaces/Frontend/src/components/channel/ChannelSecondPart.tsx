import styles from "@/styles/profile/Profile.module.css";
import ChannelInfoCard from "./infos/ChannelInfoCard";
import { Socket } from "socket.io-client";
import { Dispatch, SetStateAction } from "react";

type Props = {
	relation: ChannelUsersRelation;
  setRelation: Dispatch<SetStateAction<ChannelUsersRelation>>
	myRelation: UserRelation;
	socket: Socket | undefined;
  };

export default function ChannelSecondPart({ relation, setRelation, myRelation, socket }: Props) {

  return (
	<div className={styles.both + " " + styles.second}>
		<ChannelInfoCard relation={relation} setRelation={setRelation} myRelation={myRelation} socket={socket}  />
	</div>
  );
}