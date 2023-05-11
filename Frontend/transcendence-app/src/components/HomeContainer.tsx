import React from 'react';

import styles from '@/styles/Home.module.css';

import ClientService from '@/services/Client.service'

const service = new ClientService();

export default function HomeContainer() {

    return (
        <div className={styles.main} style={{ textAlign: 'center' }}>
            <p>Transcendence</p>
        </div>
    );
}