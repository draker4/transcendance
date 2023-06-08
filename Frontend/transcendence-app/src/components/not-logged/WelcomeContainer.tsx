"use client"

import React from 'react';

import styles from '@/styles/Welcome.module.css';

export default function WelcomeContainer() {

    return (
        <div className={styles.main} style={{ textAlign: 'center' }}>
            <p>Crunchy Pong !</p>
        </div>
    );
}