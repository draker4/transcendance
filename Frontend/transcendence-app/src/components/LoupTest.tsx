import React from 'react';

import styles from '@/styles/LoupTest.module.css';

import Client from '@/services/Client.service'

const service = new Client();

export default function LoupTest() {

    return (
        <div className={styles.main} style={{ textAlign: 'center' }}>
            <p>Crunchy Pong !</p>
        </div>
    );
}