import styles from "@/styles/profile/InfoCard.module.css";
import { ChannelRoles } from "@/lib/enums/ChannelRoles.enum";
import RolesItem from "./RolesItem";

type Props = {
  channelId: number;
  relations: UserRelation[];
  role: ChannelRoles;
  myRelation: UserRelation;
  lists:ChannelLists;
};

export default function RolesList({ channelId, relations, role, myRelation, lists }: Props) {
  return (
    <div className={styles.rolesList}>
      <p className={styles.tinyTitle}>{role}</p>
      <ul>
        {relations.map((relation) => (
          <li key={relation.userId}>
            <RolesItem
			  channelId={channelId}
              relation={relation}
			  myRelation={myRelation}
			  role={role}
              onFocusOn={() => {/*console.log("Focused")*/}}
              onFocusOff={() => {/* console.log("Blurred") */}}
              onHover={() => {/* console.log("Hoover") */}}
              onLeave={() => {/* console.log("Leave") */}}
			  lists={lists}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
