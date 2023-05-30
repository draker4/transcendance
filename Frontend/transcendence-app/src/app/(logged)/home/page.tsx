import Client from '@/services/Client.service';
import styles from "@/styles/Home.module.css"

const	client = new Client();

export default function HomePage() {

  return (
    <main className={styles.main}>
      <div>
        <div>{ client.profile.id }</div>
        <div>{ client.profile.login }</div>
        <div>{ client.profile.first_name}</div>
        <div>{ client.profile.last_name}</div>
        <div>{ client.profile.email}</div>
        <div>{ client.profile.phone}</div>
        {/* <img src={client.profile.image} className={styles.img}></img> */}
      </div>
    </main>
  );
}
