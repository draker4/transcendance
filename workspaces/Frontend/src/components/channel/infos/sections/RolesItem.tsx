import styles from "@/styles/profile/InfoCard.module.css";
import AvatarUser from "../../../avatarUser/AvatarUser";
import Link from "next/link";
import { useState } from "react";
import ChanOpControlPannel from "./ChanOpControlPannel";
import { ChannelRoles } from "@/lib/enums/ChannelRoles.enum";

type Props = {
  channelId:number;
  relation: UserRelation;
  myRelation: UserRelation;
  role: ChannelRoles;
  onFocusOn: () => void;
  onFocusOff: () => void;
  onHover: () => void;
  onLeave: () => void;
  lists:ChannelLists;
};

export default function RolesItem({ channelId, relation, myRelation, role, onFocusOn, onFocusOff, onHover, onLeave, lists }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocusOn = () => {
    setIsFocused(true);
    onFocusOn();
  };

  const handleFocusOff = () => {
    setIsFocused(false);
    onFocusOff();
  };

  const handleHover = () => {
    setIsFocused(true);
    onHover();
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
    onLeave();
  };


  return (
    <article
      className={isFocused ? `${styles.row} ${styles.focused}` : styles.row}
      key={relation.userId}
      onFocus={handleFocusOn}
      onBlur={handleFocusOff}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.avatar}>
        <AvatarUser
          avatar={relation.user.avatar}
          borderSize="2px"
          backgroundColor={relation.user.avatar.backgroundColor}
          borderColor={relation.user.avatar.borderColor}
        />
      </div>
      <Link
        href={`/home/profile/${relation.userId}`}
        style={{ color: relation.user.avatar.borderColor }}
      >
        {relation.user.login}
      </Link>

      { isFocused && myRelation.isChanOp && <ChanOpControlPannel channelId={channelId} role={role} relation={relation} myRelation={myRelation} lists={lists} />}
    </article>
  );
}
