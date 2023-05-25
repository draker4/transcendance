"use client"

import Client from '@/services/Client.service';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from "@/styles/Home.module.css"
import { setCookie } from 'cookies-next';

const client = new Client();

export default function HomePage() {
  const code: string | null = useSearchParams().get('code');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {

      if (!client.logged && code) {
        console.log("log42");
        await client.logIn42(code);
      }

      setCookie("crunchy-token", client.token);
      setLoading(false);
    };

    fetchData();
  }, [code]);


  return (
    <main className={styles.main}>
      {loading && <div>Loading...</div>}
      {!loading && 
	  <div>
		<div>{ client.profile.id }</div>
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
