import Head from 'next/head';
import React, {} from 'react';

import HomeContainer from '@/components/HomeContainer';

import styles from '@/styles/Home.module.css';

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
        <HomeContainer />
      </main>





    </>
  );
}
