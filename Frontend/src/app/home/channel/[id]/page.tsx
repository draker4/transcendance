import ChannelMainFrame from "@/components/channel/ChannelMainFrame";
import ErrorChannel from "@/components/channel/ErrorChannel";
import { Refresher } from "@/components/refresher/Refresher";
import Avatar_Service from "@/services/Avatar.service";
import Channel_Service from "@/services/Channel.service";
import Profile_Service from "@/services/Profile.service";
import styles from "@/styles/profile/Profile.module.css";
import { cookies } from "next/dist/client/components/headers";

type Params = {
  params: {
    id: number;
  };
};

export default async function ChannelprofilePage({ params: { id } }: Params) {

  // [+] en brut pour le moment
  let myRelation: UserRelation = {
    userId: 0,
    isChanOp: false,
    isBanned: false,
    joined: false,
  };

  // [+] Recup l'info du statut user par rapport a channel
  // joined | banned | invited | operator etc... a determiner
  let channelAndUsersRelation: ChannelUsersRelation = {
    usersRelation: [],
    channel: {
      id: -1,
      name: "",
      type: "public",
      joined: false,
      avatar: {
        image: "",
        variant: "",
        borderColor: "",
        backgroundColor: "",
        text: "",
        empty: true,
        isChannel: false,
        decrypt: false,
      },
    },
  };

  // [+] Recup la channel elle meme, avec dependances des users

  try {
    const token = cookies().get("crunchy-token")?.value;
    if (!token) throw new Error("No token value");

    const avatarService = new Avatar_Service(token);
    const channelService = new Channel_Service(token);
    const profileService = new Profile_Service(token);

    // [+] possible Pas en cascade les 3 await ?! + verifier si retourne undefined
    channelAndUsersRelation = await channelService.getChannelAndUsers(id);
    channelAndUsersRelation.channel.avatar = await avatarService.getChannelAvatarById(id);

    console.log("channelAndUserStatus = ", channelAndUsersRelation); // checking
    
	// [+]
    const myProfile = await profileService.getProfileByToken();
	// console.log("myProfile = ", myProfile);
	console.log("channelAndUserStatus.usersStatus = ", channelAndUsersRelation.usersRelation);

	const findStatus: UserRelation | undefined = channelAndUsersRelation.usersRelation.find((relation)=> relation.userId === myProfile.id);
	
	console.log("findStatus = ", findStatus);

	if (findStatus !== undefined)
		myRelation = findStatus;
	else
		myRelation.userId = myProfile.id;


  } catch (err) {
    console.log(err);
    return <ErrorChannel params={{ id }} />;
}

if (
	!channelAndUsersRelation ||
    !channelAndUsersRelation.channel ||
	!channelAndUsersRelation.channel.avatar ||
    channelAndUsersRelation.channel.id === -1
	) {
	// [+] ajoutter des param a ErrorChanel, si private par ex
    return <ErrorChannel params={{ id }} />;
  }

  return (
    <div className={styles.main}>
      <Refresher />
      <ChannelMainFrame
        channelAndUsersRelation={channelAndUsersRelation} myRelation={myRelation}
      />
    </div>
  );
}
