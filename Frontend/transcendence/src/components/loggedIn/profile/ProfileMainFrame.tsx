import styles from "@/styles/loggedIn/profile/Profile.module.css";
import Profile from "@/services/Profile.service";
import ProfileFirstPart from "./ProfileFirstPart";
import ProfileSecondPart from "./ProfileSecondPart";
import avatarType from "@/types/Avatar.type";

type Props = {
  profile: Profile;
  isOwner: boolean;
  avatar: avatarType;
};

export default function ProfileMainFrame({ profile, isOwner, avatar }: Props) {
  return (
    <div className={styles.profileMainFrame}>
      <ProfileFirstPart profile={profile} isOwner={isOwner} avatar={avatar} />
      <ProfileSecondPart profile={profile} isOwner={isOwner} />
    </div>
  );
}
