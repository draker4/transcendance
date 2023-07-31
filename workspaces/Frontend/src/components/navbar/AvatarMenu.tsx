"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/styles/navbar/AvatarMenu.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AvatarUser from "../avatarUser/AvatarUser";
import ChatService from "@/services/Chat.service";

type Props = {
  avatar: Avatar;
  profile: Profile;
  token: string | undefined;
};

export default function AvatarMenu({ avatar, profile, token }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const chatService = new ChatService(token as string);
  const [avatarUpdated, setAvatarUpdated] = useState<Avatar>(avatar);
  const [login, setLogin] = useState<string>(profile.login);

  const signoff = async () => {
    try {
      await fetch(
        `http://${process.env.HOST_IP}:3000/api/signoff?id=${profile.id}`
      );
      router.push("/welcome");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setAvatarUpdated(avatar);
    setLogin(profile.login);
  }, [avatar]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const updateProfile = () => {
      chatService.socket?.emit(
        "getLoginWithAvatar",
        (payload: { login: string; avatar: Avatar }) => {
          setAvatarUpdated(payload.avatar);
          setLogin(payload.login);
        }
      );
    };

    chatService.socket?.on("notif", updateProfile);

    return () => {
      chatService.socket?.off("notif", updateProfile);
    };
  }, [chatService.socket]);

  return (
    <div className={styles.menu} onClick={() => setMenuOpen(!menuOpen)}>
      <div className={styles.avatar}>
        <AvatarUser
          avatar={avatarUpdated}
          borderSize={"3px"}
          backgroundColor={avatarUpdated.backgroundColor}
          borderColor={avatarUpdated.borderColor}
        />
      </div>
      {menuOpen && profile.id > 0 && (
        <div className={styles.dropdown} ref={menuRef}>
          <ul className={styles.list}>
            <Link href={`/home/profile/${profile.id}`}>
              <li className={styles.profile}>{login}</li>
            </Link>
            <li onClick={signoff} className={styles.logOut}>
              Log Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
