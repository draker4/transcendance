"use client";

import Profile from "@/services/Profile.service";
import styles from "@/styles/LoupTest/ProfileCard.module.css"
import { Dispatch, SetStateAction } from "react";


type AvatarState = {
    avatar: string;
    setAvatar: Dispatch<SetStateAction<string>>;
    profileImage: string;
}

export default function ButtonChangeAvatar( { avatar, setAvatar, profileImage } : AvatarState) {

    const handleClick = () => {
        if (avatar === profileImage) {
            console.log("Change Avatar asked");
            console.log(`avatar before : ${avatar}`);
            setAvatar('/images/loupTest/avatar_temp1.png');
        } else {
            console.log("Change Avatar asked");
            console.log(`avatar before : ${avatar}`);
            setAvatar(profileImage);
        }
    }



    const content = ( 
            <button className={styles.button} onClick={handleClick}>change Avatar</button>
    );

    return content;
}
