import styles from "@/styles/profile/InfoCard.module.css";
import { ChannelRoles } from "@/lib/enums/ChannelRoles.enum";
import RolesList from "./RolesList";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type Props = {
  channelAndUsersRelation: ChannelUsersRelation;
  myRelation: UserRelation;
  socket: Socket | undefined;
};

export default function SectionPongers({
  channelAndUsersRelation,
  myRelation,
  socket,
}: Props) {

const	[operators, setOperators] = useState<UserRelation[]>([]);
const	[pongers, setPongers] = useState<UserRelation[]>([]);
const	[invited, setInvited] = useState<UserRelation[]>([]);
const	[banned, setBanned] = useState<UserRelation[]>([]);
const	[leavers, setLeavers] = useState<UserRelation[]>([]);
const [notif, setNotif] = useState<string>("");

useEffect(() => {
  // need new instances
  const filteredOperators = channelAndUsersRelation.usersRelation.filter((relation) => (relation.isChanOp && !relation.isBanned));
  const filteredPongers = channelAndUsersRelation.usersRelation.filter((relation) => (relation.joined && !relation.isChanOp && !relation.isBanned));
  const filteredInvited = channelAndUsersRelation.usersRelation.filter((relation) => (!relation.joined && !relation.isChanOp && !relation.isBanned && relation.invited));
  const filteredBanned = channelAndUsersRelation.usersRelation.filter((relation) => (relation.isBanned));
  const filteredLeavers = channelAndUsersRelation.usersRelation.filter((relation) => (!relation.joined && !relation.isChanOp && !relation.isBanned && !relation.invited));

  setOperators(filteredOperators);
  setPongers(filteredPongers);
  setInvited(filteredInvited);
  setBanned(filteredBanned);
  setLeavers(filteredLeavers);

}, [channelAndUsersRelation]);

	const lists:ChannelLists = {
		setOperators: setOperators,
		setPongers: setPongers,
		setInvited: setInvited,
		setBanned: setBanned,
		setLeavers: setLeavers,
		setNotif: setNotif,
	}

  const renderRowList = (role:ChannelRoles, relations: UserRelation[]):JSX.Element => {
    if ((relations.length === 0)) {
      return <></>
    } else {
      return (
        <RolesList channelId={channelAndUsersRelation.channel.id} relations={relations} myRelation={myRelation} role={role} lists={lists} socket={socket}/>
      );
    }
  };

  const putSpliter = ():JSX.Element  => {
	if (myRelation.isChanOp) {
		if (invited.length === 0 && banned.length === 0 && leavers.length === 0)
			return <></>;
	} else {
		if (invited.length === 0 && banned.length === 0)
		return <></>;
	}
	return <div className={styles.spliter}></div>
  }

  return <div className={styles.sections}>
	<p className={styles.notif}>{notif}</p>
    {renderRowList(ChannelRoles.operator, operators)}
    {renderRowList(ChannelRoles.ponger, pongers)}
	{putSpliter()}
    {renderRowList(ChannelRoles.invited, invited)}
    {myRelation.isChanOp && renderRowList(ChannelRoles.leaver, leavers)}
    {renderRowList(ChannelRoles.banned, banned)}
  </div>;
}
