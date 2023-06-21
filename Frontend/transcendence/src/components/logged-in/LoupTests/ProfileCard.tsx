"use client";

import Profile from "@/services/Profile.service";
import styles from "@/styles/LoupTest/ProfileCard.module.css"
import ButtonChangeAvatar from "./ButtonChangeAvatar";
import { useState, Dispatch, SetStateAction, ChangeEvent } from "react";


type Props = {
    profile: Profile;
}

type AvatarState = {
    avatar: string;
    setAvatar: Dispatch<SetStateAction<string>>;
    profileImage: string;
}


export default function ProfileCard({profile} : Props) {

    const [avatar, setAvatar] = useState<string>(profile.image);

    const avatarAltValue: string = `player ${profile.login}'s avatar`;

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            setAvatar(e.target?.result as string);
        };

        if (file !== undefined)
            reader.readAsDataURL(file);
    }

    const content = (
        
        <div className={styles.main}>
            <div className={styles.title}>{profile.login} ' s ProfileCard</div>
            <div className={styles.circle}>
                <img className={styles.img} src={avatar} alt={avatarAltValue}/>
            </div>
            <ButtonChangeAvatar avatar={avatar} setAvatar={setAvatar} profileImage={profile.image}/>
            <input className={styles.input} type="file" onChange={handleFileChange} accept="image/*" />
        </div>

    );

    return content;
}