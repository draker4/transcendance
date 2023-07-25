import styles from "@/styles/profile/InfoCard.module.css";
import { ChannelRoles } from "@/lib/enums/ChannelRoles.enum";
import RolesItem from "./RolesItem";

type Props = {
  relations: UserRelation[];
  role: ChannelRoles;
};

export default function RolesList({ relations, role }: Props) {
  return (
    <div className={styles.rolesList}>
      <p className={styles.tinyTitle}>{role}</p>
      <ul>
        {relations.map((relation) => (
          <li key={relation.userId}>
            <RolesItem
              relation={relation}
              onFocusOn={() => console.log("Focused")}
              onFocusOff={() => console.log("Blurred")}
              onHover={() => console.log("Hoover")}
              onLeave={() => console.log("Leave")}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
