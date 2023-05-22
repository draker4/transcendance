"use client"

import React from 'react';

import styles from '@/styles/Home.module.css';

import ClientService from '@/services/Client.service'

const service = new ClientService();

export default function HomeContainer() {

    const   LogIn42 = async () => {
        const   res = await fetch("api/auth/42");
    }

    return (
        <div className={styles.main} style={{ textAlign: 'center' }}>
            <p>Crunchy Pong !</p>
            <button onClick={() => LogIn42()}>Log in with 42</button>
        </div>
    );
}
