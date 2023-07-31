import styles from "@/styles/profile/Profile.module.css";
import AvatarCard from "./avatar/AvatarCard";

type Props = {
  login: string;
  isOwner: boolean;
  avatar: Avatar;
};

export default function ProfileFirstPart({ login, isOwner, avatar }: Props) {

  return (
    <div className={`${styles.both} ${styles.first}`}>
      <AvatarCard
        login={login}
        isOwner={isOwner}
        avatar={avatar}
      />
    </div>
  );
}
