import Image from "next/image";
import styles from "@/styles/lobby/HomeProfile.module.css";

type Props = {
    profile: Profile;
};

export default function HomeProfile({ profile }: Props) {
    return (
        <div className={styles.homeProfil}>
            <div className={styles.profileInfo}>
                <div>{`${profile.first_name} ${profile.last_name}`}</div>
                <div>{profile.email}</div>
            </div>
            {profile.image && (
                <Image
                    alt="profile image"
                    src={profile.image}
                    referrerPolicy="no-referrer"
                    className={styles.profilePicture}
                    width={200}
                    height={200}
                />
            )}
        </div>
    );
}
