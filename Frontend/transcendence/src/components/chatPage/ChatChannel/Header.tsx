import AvatarUser from "@/components/avatarUser/AvatarUser";
import styles from "@/styles/chatPage/ChatChannel/ChatChannel.module.css"
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  channel: Channel;
};

export default function 
Header({ icon, channel }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.icon}>{icon}</div>

	  {/* [+][!] Attention si besoin de changer le link en fonctin du channel.type */}
      <Link href={"/home/profile/" + channel.name} className={styles.card}>
        <div className={styles.avatar}>
          <AvatarUser
            avatar={channel.avatar}
            borderSize="3px"
            borderColor={channel.avatar.borderColor}
            backgroundColor={channel.avatar.backgroundColor}
          />
        </div>
        <div style={{ color: channel.avatar.borderColor }}> {channel.name} </div>
      </Link>
    </div>
  );
}
