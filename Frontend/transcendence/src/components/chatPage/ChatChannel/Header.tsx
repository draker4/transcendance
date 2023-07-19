import AvatarUser from "@/components/avatarUser/AvatarUser";
import Channel_Service from "@/services/Channel.service";
import styles from "@/styles/chatPage/ChatChannel/ChatChannel.module.css"
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  channel: Channel;
  myself: Profile & { avatar: Avatar };
  channelCodeName: string;
};

export default function 
Header({ icon, channel, myself, channelCodeName }: Props) {

	const channelService = new Channel_Service();
	let url:string = "";
	
	// console.log("channelCodeName = ", channelCodeName); [!]

	if (channel.type === "privateMsg" && channelCodeName) {

		const tuple: {
			id1: number;
			id2: number;
		} = channelService.getIdsFromPrivateMsgChannelName(channelCodeName);

		const otherId:number = myself.id === channel.id ? tuple.id2 : tuple.id1;
		url = "/home/profile/" + otherId;
	} else {
		url = "/home/channel/" + channel.id;
	}


  return (
    <div className={styles.header}>
      <div className={styles.icon}>{icon}</div>

	  {/* [+][!] Attention si besoin de changer le link en fonctin du channel.type */}
      <Link href={url} className={styles.card}>
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
