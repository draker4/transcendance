import ChannelMainFrame from "@/components/channel/ChannelMainFrame";
import ErrorChannel from "@/components/channel/ErrorChannel";
import { Refresher } from "@/components/refresher/Refresher";
import Avatar_Service from "@/services/Avatar.service";
import Channel_Service from "@/services/Channel.service";
import styles from "@/styles/profile/Profile.module.css";
import { cookies } from "next/dist/client/components/headers";

type Params = {
	params: {
	  id: number;
	};
};

export default async function ChannelprofilePage({ params: { id } }: Params) {
	
	// [+] en brut pour le moment
	let userStatus: UserStatus = {
		userId: 0,
		chanOp: true,
		isbanned: false,
		joined: true,
	};
	
	// [+] Recup l'info du statut user par rapport a channel
	// joined | banned | invited | operator etc... a determiner

	let avatar: Avatar = {
		image: "",
		variant: "",
		borderColor: "",
		backgroundColor: "",
		text: "",
		empty: true,
		isChannel: false,
		decrypt: false,
	};

	let channel:Channel = {
		id: -1,
		name: "",
		avatar: {
			image: "",
			variant: "",
			borderColor: "",
			backgroundColor: "",
			text: "",
			empty: false,
			isChannel: false,
			decrypt: false
		},
		type: "public",
		joined: false,
	}

	// [+] Recup la channel elle meme, avec dependances des users

	try {
		const token = cookies().get("crunchy-token")?.value;
		if (!token) throw new Error("No token value");

		const avatarService = new Avatar_Service(token);
		const channelService = new Channel_Service(token);

		// [+] ameliorable pour tout avoir en un fetch avec relations ?
		avatar = await avatarService.getChannelAvatarById(id);
		
		// [+] f
		channel = await channelService.getChannelAndUsers(id);
		
		channel.avatar = avatar;

		console.log("AVATAR = ", avatar); // checking
		console.log("\nCHANNEL&UsersRelations = ", channel); // checking
		


	} catch (err) {
		console.log(err);
		// [+] ajoutter des param a ErrorChanel, si private par ex
		return <ErrorChannel params={{id}}/>;
	  }


  return (
	<div className={styles.main}>
		<Refresher />
		<ChannelMainFrame avatar={avatar} userStatus={userStatus} channel={channel}/>
	</div>
  )
}
