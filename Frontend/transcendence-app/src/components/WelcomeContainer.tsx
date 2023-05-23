"use client"

import React, { useState } from 'react';

import styles from '@/styles/Home.module.css';

import ClientService from '@/services/Client.service'

const service = new ClientService();

export default function WelcomeContainer() {

    const   LogIn42 = () => {
        window.open(process.env.URL_42, "_self");
    }

    return (
        <div className={styles.main} style={{ textAlign: 'center' }}>
            <p>Crunchy Pong !</p>
            <button onClick={() => LogIn42()}>Log in with 42</button>
        </div>
    );
}
