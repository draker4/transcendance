import styles from "@/styles/profile/InfoCard.module.css";
import { ChannelRoles } from "@/lib/enums/ChannelRoles.enum";
import RolesItem from "./RolesItem";
import { Socket } from "socket.io-client";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  channelId: number;
  relations: UserRelation[];
  role: ChannelRoles;
  myRelation: UserRelation;
  lists:ChannelLists;
  socket: Socket | undefined;
  icon:IconDefinition;
};

export default function RolesList({ channelId, relations, role, myRelation, lists, socket, icon }: Props) {
  return (
    <div className={styles.rolesList}>
      <p className={styles.tinyTitle}><FontAwesomeIcon icon={icon} />&thinsp;{role}</p>
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
			  socket={socket}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
