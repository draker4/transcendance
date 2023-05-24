"use client"

import React from 'react';

import styles from '@/styles/Home.module.css';

export default function WelcomeContainer() {

    const   Open42 = () => {
        window.open(process.env.URL_42, "_self");
    }

    return (
        <div className={styles.main} style={{ textAlign: 'center' }}>
            <p>Crunchy Pong !</p>
            <button onClick={() => Open42()}>Log in with 42</button>
        </div>
    );
}
