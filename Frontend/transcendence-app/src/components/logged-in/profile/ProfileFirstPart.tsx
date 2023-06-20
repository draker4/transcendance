import styles from "@/styles/profile/Profile.module.css"
import Profile from "@/services/Profile.service"
import AvatarCard from "./avatar/AvatarCard"
import avatarType from "@/types/Avatar.type";
import { cookies } from "next/dist/client/components/headers";

type Props = {
    profile: Profile;
	isOwner: boolean;
	avatar: avatarType;
}

export default function ProfileFirstPart({profile, isOwner, avatar} : Props) {
	const token = cookies().get("crunchy-token")?.value;
	const unwrappedToken: string = typeof token === 'string' ? token : "";
	
  return (
	<div className={`${styles.both} ${styles.first}`}>
		<AvatarCard profile={profile} isOwner={isOwner} avatar={avatar} token={unwrappedToken}/>
	</div>
  )
}
