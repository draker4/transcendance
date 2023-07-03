import styles from "@/styles/loggedIn/profile/Profile.module.css";
import ProfileFirstPart from "./ProfileFirstPart";
import ProfileSecondPart from "./ProfileSecondPart";

type Props = {
  profile: Profile;
  isOwner: boolean;
  avatar: Avatar;
};

export default function ProfileMainFrame({ profile, isOwner, avatar }: Props) {
  return (
    <div className={styles.profileMainFrame}>
      <ProfileFirstPart profile={profile} isOwner={isOwner} avatar={avatar} />
      <ProfileSecondPart profile={profile} isOwner={isOwner} />
    </div>
  );
}
