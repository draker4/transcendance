"use client"

import Client from '@/services/Client.service';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const client = new Client();

export default function HomePage() {
  const code: string | null = useSearchParams().get('code');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {

      if (code && !client.logged) {
        await client.logIn42(code);
      }

      setLoading(false); // Set loading to false after login process
    };

    fetchData();
  }, [code]);

//   if (loading) {
//     return <div>Loading...</div>; // Display loading state while login process is in progress
//   }

  return (
    <main>
      <div>Main</div>
      {loading && <div>salut not log</div>}
      {!loading && <div>{ client.profile.login }</div>}
    </main>
  );
}
