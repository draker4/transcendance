import { getProfileByToken } from "@/lib/profile/getProfileInfos";
import Profile from "@/services/Profile.service";
import styles from "@/styles/page/Home.module.css";
import { cookies } from "next/dist/client/components/headers";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  let profile = new Profile();

  try {
    const token = cookies().get("crunchy-token")?.value;
    if (!token) throw new Error("No token value");

    profile = await getProfileByToken(token);
  } catch (err) {
    console.log(err);
  }

  return (
    <main className={styles.main}>
      <div>
        <div>
          <Link href={`/home/profile/${profile.login}`}>{profile.login}</Link>
        </div>
        {profile.image && (
          <Image
            alt="profile image"
            src={profile.image}
            referrerPolicy="no-referrer"
            className={styles.img}
            width={200}
            height={200}
          />
        )}
        <div>
          <Link href="/home/game">Game</Link>
        </div>
        <div>
          <Link href="/home/pong">Pong</Link>
        </div>
      </div>
    </main>
  );
}
