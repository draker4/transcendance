"use client";

import Profile from "@/services/Profile.service";
import styles from "@/styles/LoupTest/ProfileCard.module.css"
import ButtonChangeAvatar from "./ButtonChangeAvatar";
import { useState } from "react";


type Props = {
    profile: Profile;
}

export default function ProfileCard({profile} : Props) {

    const [avatar, setAvatar] = useState<string>(profile.image);

    const avatarAltValue: string = `player ${profile.login}'s avatar`;

    const content = (
        
        <div className={styles.main}>
            <div className={styles.title}>{profile.login} ' s ProfileCard</div>
            <div className={styles.circle}>
                <img className={styles.img} src={avatar} alt={avatarAltValue}/>
            </div>
            <ButtonChangeAvatar avatar={avatar} setAvatar={setAvatar} profileImage={profile.image}/>
        </div>

    );

    return content;
}