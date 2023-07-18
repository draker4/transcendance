"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/styles/navbar/AvatarMenu.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AvatarUser from "../avatarUser/AvatarUser";

type Props = {
  avatar: Avatar;
  profile: Profile;
};

export default function NavbarHome({ avatar, profile }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const signoff = async () => {
    try {
      await fetch(`http://${process.env.HOST_IP}:3000/api/signoff`);
      router.push("/welcome");
    }
    catch (error) {
      console.log(error);
    }
  };

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

  return (
    <div className={styles.menu} onClick={() => setMenuOpen(!menuOpen)}>
      <div className={styles.avatar}>
        <AvatarUser
          avatar={avatar}
          borderSize={"3px"}
          backgroundColor={avatar.backgroundColor}
          borderColor={avatar.borderColor}
        />
      </div>
      {menuOpen && profile.id > 0 && (
        <div className={styles.dropdown} ref={menuRef}>
          <ul className={styles.list}>
            <Link href={`/home/profile/${profile.id}`}>
              <li className={styles.profile}>{profile.login}</li>
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
