import { getProfileByToken } from "@/lib/profile/getProfileInfos";
import Profile from "@/services/Profile.service";
import styles from "@/styles/Home.module.css"
import { cookies } from 'next/dist/client/components/headers';

export default async function HomePage() {

  let profile = new Profile();

  try {
    const token = cookies().get("crunchy-token")?.value;
    if (!token)
      throw new Error("No token value");
    
    profile = await getProfileByToken(token);
  }
  catch (err) {
    console.log(err);
  }

  return (
    <main className={styles.main}>
      <div>
        <div>{ profile.id }</div>
        <div>{ profile.login }</div>
        <div>{ profile?.first_name}</div>
        <div>{ profile?.last_name}</div>
        <div>{ profile.email}</div>
        <div>{ profile?.phone}</div>
        { <img src={profile?.image} className={styles.img}></img> }
      </div>
    </main>
  );
}
