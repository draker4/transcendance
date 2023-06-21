"use client";

import styles from "@/styles/navbar/Navbar.module.css";
import avatarType from "@/types/Avatar.type";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import AvatarUser from "../loggedIn/avatarUser/AvatarUser";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import Image from "next/image";
import Theme from "../theme/Theme";

export default function NavbarHome({ avatar }: { avatar: avatarType }) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();

  const signoff = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    deleteCookie("crunchy-token");
    router.push("/welcome");
  };

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
          <div className={styles.avatar} onClick={signoff}>
            <AvatarUser
              avatar={avatar}
              borderSize={"3px"}
              backgroundColor={avatar.backgroundColor}
              borderColor={avatar.borderColor}
            />
          </div>
        )}
      </div>
    </nav>
  );
}
