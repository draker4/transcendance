import ChannelMainFrame from "@/components/channel/ChannelMainFrame";
import ErrorChannel from "@/components/channel/ErrorChannel";
import { Refresher } from "@/components/refresher/Refresher";
import Avatar_Service from "@/services/Avatar.service";
import Channel_Service from "@/services/Channel.service";
import Profile_Service from "@/services/Profile.service";
import styles from "@/styles/profile/Profile.module.css";
import { cookies } from "next/dist/client/components/headers";
import { findDOMNode } from "react-dom";

type Params = {
  params: {
    id: number;
  };
};

export default async function ChannelprofilePage({ params: { id } }: Params) {
  let token: string = "";
  let myRelation: UserRelation = {
    userId: 0,
    isBoss: false,
    isChanOp: false,
    isBanned: false,
    joined: false,
    invited: false,
    muted: false,
    user: {
      id: 0,
      login: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      image: "",
      provider: "",
      motto: "",
      story: "",
      gameKey: "Arrow",
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

  let channelAndUsersRelation: ChannelUsersRelation = {
    usersRelation: [],
    channel: {
      id: -1,
      name: "",
      type: "public",
      password: "",
      joined: false,
      isBanned: false,
      isBoss: false,
      isChanOp: false,
      invited: false,
      muted: false,
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

  try {
    const tryToken = cookies().get("crunchy-token")?.value;
    if (!tryToken) throw new Error("No token value");

    token = tryToken;

    const avatarService = new Avatar_Service(token);
    const channelService = new Channel_Service(token);
    const profileService = new Profile_Service(token);

    channelAndUsersRelation = await channelService.getChannelAndUsers(id);
    if (!channelAndUsersRelation) 
      throw new Error("channel not found");

    channelAndUsersRelation.channel.avatar =
      await avatarService.getChannelAvatarById(id);
    if (!channelAndUsersRelation.channel || !channelAndUsersRelation.channel.avatar)
      throw new Error("channel avatar not found");
    
    const myProfile = await profileService.getProfileByToken();
    if (!myProfile) throw new Error("profile not found");

    const findStatus: UserRelation | undefined =
      channelAndUsersRelation.usersRelation.find(
        (relation) => relation.userId === myProfile.id
      );

    if (findStatus !== undefined) myRelation = findStatus;
    else myRelation.userId = myProfile.id;

    if (findStatus && findStatus.isBanned)
      throw new Error("you are banned from this channel");

    if (
      (!findStatus || (!findStatus.isBoss && !findStatus.joined)) &&
      channelAndUsersRelation &&
      channelAndUsersRelation.channel.type === "private"
    )
      throw new Error("channel is private");
  } catch (err: any) {

    if (process.env && process.env.ENVIRONNEMENT && process.env.ENVIRONNEMENT === "dev")
      console.log(err);

    if (err.message && typeof err.message === "string")
      return <ErrorChannel id={id} caughtErrorMsg={err.message} />;
    else return <ErrorChannel id={id} />;
  }

  if (
    !channelAndUsersRelation ||
    !channelAndUsersRelation.channel ||
    !channelAndUsersRelation.channel.avatar ||
    channelAndUsersRelation.channel.id === -1 ||
    channelAndUsersRelation.channel.type === "privateMsg"
  ) {
    return <ErrorChannel id={id} />;
  }

  return (
    <div className={styles.main}>
      <Refresher />
      <ChannelMainFrame
        token={token}
        channelAndUsersRelation={channelAndUsersRelation}
        myRelation={myRelation}
      />
    </div>
  );
}
