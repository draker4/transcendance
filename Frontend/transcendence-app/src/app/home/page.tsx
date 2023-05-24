"use client"

import Client from '@/services/Client.service';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from "@/styles/Home.module.css"

const client = new Client();

export default function HomePage() {
  const code: string | null = useSearchParams().get('code');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {

      if (code && !client.logged) {
        await client.logIn42(code);
      }

      setLoading(false);
    };

    fetchData();
  }, [code]);

  return (
    <main className={styles.main}>
      {loading && <div>Loading...</div>}
      {!loading && 
	  <div>
		<div>{ client.profile.login }</div>
		<div>{ client.profile.first_name}</div>
		<div>{ client.profile.last_name}</div>
		<div>{ client.profile.email}</div>
		<div>{ client.profile.phone}</div>
		<img src={client.profile.image} className={styles.img}></img>
	  </div>}
    </main>
  );
}
