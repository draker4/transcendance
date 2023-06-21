"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@/styles/navbar/Navbar.module.css";
import avatarType from "@/types/Avatar.type";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import AvatarUser from "../loggedIn/avatarUser/AvatarUser";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import Image from "next/image";
import Theme from "../theme/Theme";
import Profile from "@/services/Profile.service";
import AvatarMenu from "./AvatarMenu";

export default function NavbarHome({
  avatar,
  profile,
}: {
  avatar: avatarType;
  profile: Profile;
}) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const signoff = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    deleteCookie("crunchy-token");
    router.push("/welcome");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className={styles.nav}>
      <Link href="/welcome">
        <div className={styles.left}>
          <Image
            src="/images/logo.png"
            alt="Logo Crunchy Pong"
            width={50}
            height={50}
            title="Logo Crunchy Pong"
            className={styles.logo}
          />
          <h2 className={styles.title}>Crunchy Pong</h2>
        </div>
      </Link>
      <div className={styles.right}>
        <Theme />
        {segment !== "create" && (
          <div
            className={styles.avatar}
            onClick={toggleDropdown}
            ref={dropdownRef}
          >
            <AvatarUser
              avatar={avatar}
              borderSize={"3px"}
              backgroundColor={avatar.backgroundColor}
              borderColor={avatar.borderColor}
            />
            {isDropdownOpen && (
              <AvatarMenu
                profile={profile}
                setIsDropdownOpen={setIsDropdownOpen}
              />
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
