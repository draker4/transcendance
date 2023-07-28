import styles from "@/styles/lobby/HomeProfile.module.css";
import AvatarUser from "../avatarUser/AvatarUser";

type Props = {
  profile: Profile;
  avatar: Avatar;
};

export default function HomeProfile({ profile, avatar }: Props) {
  return (
    <div className={styles.homeProfil}>
      <div className={styles.avatar}>
        <AvatarUser
          avatar={avatar}
          borderSize={"6px"}
          backgroundColor={avatar.backgroundColor}
          borderColor={avatar.borderColor}
        />
      </div>
      <div className={styles.profileInfo}>
        <p>{profile.login}</p>
        <p>{profile.story}</p>
      </div>
    </div>
  );
}
