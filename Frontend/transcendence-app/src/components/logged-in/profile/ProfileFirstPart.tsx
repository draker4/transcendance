import styles from "@/styles/profile/Profile.module.css"
import Profile from "@/services/Profile.service"
import AvatarCard from "./avatar/AvatarCard"
import avatarType from "@/types/Avatar.type";

type Props = {
    profile: Profile;
	isOwner: boolean;
	avatar: avatarType;
}

export default function ProfileFirstPart({profile, isOwner, avatar} : Props) {
  return (
	<div className={`${styles.both} ${styles.first}`}>
		<AvatarCard profile={profile} isOwner={isOwner} avatar={avatar}/>
	</div>
  )
}
