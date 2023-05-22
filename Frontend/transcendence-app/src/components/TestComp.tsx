"use client"

import { useState } from 'react';

import styles from '@/styles/Test.module.css';

import Client from '@/services/Client.service';

const service = new Client();

export default function TestForm() {

    const [message, setMessage] = useState<string>("");
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const Register_User = () => {
        setLoading(true);

        service.Register_User(username, password).then((response) => {
            
            if (response.status === 200) {
                setMessage(JSON.stringify(response, null, 4));
            }

            else {
                setMessage(JSON.stringify(response, null, 4));
            }


        }).catch((error) => {
            console.log('Une erreur est survenue ( API down ? )');
            setMessage('Une erreur est survenue ( API down ? )');

        }).finally(() => {
            setLoading(false);
            
        });
    }


















    const Get_All_User = () => {
        setLoading(true);

        service.Get_All_User().then((response) => {

            if (response.status === 200) {
                setMessage(JSON.stringify(response, null, 4));
            }
            else {
                setMessage(JSON.stringify(response, null, 4));
            }

        }).catch((error) => {
            console.log('Une erreur est survenue ( API down ? )');
            setMessage('Une erreur est survenue ( API down ? )');

        }).finally(() => {
            setLoading(false);

        });
    }           

    return (
        <div className={styles.form_container}>
            <h1 className={styles.form_title}>Créer un compte</h1>

            <label htmlFor="username" className={styles.form_label}>Nom d'utilisateur</label>
            <input type="text" placeholder="Nom d'utilisateur" className={styles.form_input} value={username} onChange={(e) => {
                setUsername(e.target.value);
            }} />

            <label htmlFor="password" className={styles.form_label}>Mot de passe</label>
            <input type="password" placeholder="Mot de passe" className={styles.form_input} value={password} onChange={(e) => {
                setPassword(e.target.value);
            }} />

            <button type="submit" className={styles.form_button} onClick={Register_User} disabled={loading}>{loading ? 'Inscription en cours...' : 'Créer un compte'}</button>

            <button type="submit" className={styles.form_button} onClick={Get_All_User} disabled={loading}>{loading ? 'Requette en cours...' : 'Affichier les users de la base'}</button>
            
            { message != "" && <p> {message} </p> }
        </div>
    );
}
