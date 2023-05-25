import Head from 'next/head';
import React, {} from 'react';

import LoupTest from '@/components/LoupTest';

import styles from '@/styles/LoupTest.module.css';

export default function Home() {
  return (
    <>



      <Head>
        <title>Transcendence</title>
        <meta
          name="description"
          content="Transcendence is a multiplayer game where you can play with your friends and chat with them."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>







      <main className={styles.main} style={{ textAlign: 'center' }}>
        <LoupTest />
      </main>





    </>
  );
}
