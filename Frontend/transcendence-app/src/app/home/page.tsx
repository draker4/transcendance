import { getProfileByLogin, getProfileByToken } from "@/lib/profile/getProfileInfos";
import Profile from "@/services/Profile.service";
import styles from "@/styles/Home.module.css";
import { cookies } from 'next/dist/client/components/headers';
import Link from "next/link";

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
        { <img src={profile?.image} referrerPolicy="no-referrer" className={styles.img}></img> }
		<div style={{ fontSize: '0.9rem' }}><Link style={{ textDecoration: 'none' }} href="/home/profile">-&gt; /home/profile (not found)</Link></div>
		<div style={{ fontSize: '0.9rem' }}><Link style={{ textDecoration: 'none' }} href="/home/profile/bapt">-&gt; /home/profile/bapt</Link></div>
		<div style={{ fontSize: '0.9rem' }}><Link style={{ textDecoration: 'none' }} href="/home/profile/yops">-&gt; /home/profile/yops</Link></div>
		<br />
		<div style={{ fontSize: '1.5rem' }}><Link style={{ textDecoration: 'none' }} href={`/home/profile/${profile.login}`}>-&gt; my profile page</Link></div>
      </div>
    </main>
  );
}
