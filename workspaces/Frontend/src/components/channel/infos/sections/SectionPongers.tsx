import styles from "@/styles/profile/InfoCard.module.css";
import { ChannelRoles } from "@/lib/enums/ChannelRoles.enum";
import RolesList from "./RolesList";
import { useEffect, useState } from "react";

type Props = {
  channelAndUsersRelation: ChannelUsersRelation;
  myRelation: UserRelation;
};

export default function SectionPongers({
  channelAndUsersRelation,
  myRelation,
}: Props) {
//   console.log("Channel&UsersRelation : ", channelAndUsersRelation);
const	[operators, setOperators] = useState<UserRelation[]>(channelAndUsersRelation.usersRelation.filter((relation) => (relation.isChanOp && !relation.isBanned)));
const	[pongers, setPongers] = useState<UserRelation[]>(channelAndUsersRelation.usersRelation.filter((relation) => (relation.joined && !relation.isChanOp && !relation.isBanned)));
const	[invited, setInvited] = useState<UserRelation[]>(channelAndUsersRelation.usersRelation.filter((relation) => (!relation.joined && !relation.isChanOp && !relation.isBanned)));
const	[banned, setBanned] = useState<UserRelation[]>(channelAndUsersRelation.usersRelation.filter((relation) => (relation.isBanned)));

//   const invited = channelAndUsersRelation.usersRelation.filter((relation) => (!relation.joined && !relation.isChanOp && !relation.isBanned));
//   const operators = channelAndUsersRelation.usersRelation.filter((relation) => (relation.isChanOp && !relation.isBanned))
//   const banned = channelAndUsersRelation.usersRelation.filter((relation) => (relation.isBanned));

	const lists:ChannelLists = {
		setOperators: setOperators,
		setPongers: setPongers,
		setInvited: setInvited,
		setBanned: setBanned,
	}

  const renderRowList = (role:ChannelRoles, relations: UserRelation[]) => {
    if ((relations.length === 0)) {
      return <></>
    } else {
      return (
        <RolesList relations={relations} myRelation={myRelation} role={role} lists={lists}/>
      );
    }
  };

  return <div className={styles.sections}>
    {renderRowList(ChannelRoles.operator, operators)}
    {renderRowList(ChannelRoles.ponger, pongers)}
    {renderRowList(ChannelRoles.invited, invited)}
    {renderRowList(ChannelRoles.banned, banned)}
  </div>;
}
