"use client";

import { useState } from "react";
import styles from "@/styles/navbar/AvatarMenu.module.css";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import Profile from "@/services/Profile.service";
import AvatarUser from "../loggedIn/avatarUser/AvatarUser";

type Props = {
  avatar: avatarType;
  profile: Profile;
};

export default function NavbarHome({ avatar, profile }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const signoff = () => {
    deleteCookie("crunchy-token");
    router.push("/welcome");
  };

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={styles.avatar} onClick={handleMenu}>
      <AvatarUser
        avatar={avatar}
        borderSize={"3px"}
        backgroundColor={avatar.backgroundColor}
        borderColor={avatar.borderColor}
      />
      {menuOpen && profile.id > 0 && (
        <div className={styles.dropdown}>
          <ul className={styles.list}>
            <Link href={`/home/profile/${encodeURIComponent(profile.login)}`}>
              <li onClick={handleMenu} className={styles.profile}>
                {profile.login}
              </li>
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
