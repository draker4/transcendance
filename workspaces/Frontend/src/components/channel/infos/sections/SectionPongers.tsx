import styles from "@/styles/profile/InfoCard.module.css";
import { ChannelRoles } from "@/lib/enums/ChannelRoles.enum";
import RolesList from "./RolesList";
import { useState } from "react";

type Props = {
  channelAndUsersRelation: ChannelUsersRelation;
  myRelation: UserRelation;
};

export default function SectionPongers({
  channelAndUsersRelation,
  myRelation,
}: Props) {

const	[operators, setOperators] = useState<UserRelation[]>(channelAndUsersRelation.usersRelation.filter((relation) => (relation.isChanOp && !relation.isBanned)));
const	[pongers, setPongers] = useState<UserRelation[]>(channelAndUsersRelation.usersRelation.filter((relation) => (relation.joined && !relation.isChanOp && !relation.isBanned)));
const	[invited, setInvited] = useState<UserRelation[]>(channelAndUsersRelation.usersRelation.filter((relation) => (!relation.joined && !relation.isChanOp && !relation.isBanned && relation.invited)));
const	[banned, setBanned] = useState<UserRelation[]>(channelAndUsersRelation.usersRelation.filter((relation) => (relation.isBanned)));
const	[leavers, setLeavers] = useState<UserRelation[]>(channelAndUsersRelation.usersRelation.filter((relation) => (!relation.joined && !relation.isChanOp && !relation.isBanned && !relation.invited)));
const [notif, setNotif] = useState<string>("");

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
        <RolesList channelId={channelAndUsersRelation.channel.id} relations={relations} myRelation={myRelation} role={role} lists={lists}/>
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
