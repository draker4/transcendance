"use client";

import styles from "@/styles/navbar/NavbarLogged.module.css";
import avatarType from "@/types/Avatar.type";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import AvatarUser from "../logged-in/avatarUser/AvatarUser";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import Image from "next/image";

export default function NavbarHome({ avatar }: { avatar: avatarType }) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();

  const signoff = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    deleteCookie("crunchy-token");
    router.push("/welcome");
  };

  return (
    <nav className={styles.main}>
      {segment !== "create" && (
        <>
          <div className={styles.center}>
            <Link href="/welcome">
              <Image
                src="/images/logo.png"
                alt="Logo Crunchy Pong"
                width={50}
                height={50}
                title="Logo Crunchy Pong"
                className={styles.logo}
              />
            </Link>
            <div className={styles.avatar} onClick={signoff}>
              <AvatarUser
                avatar={avatar}
                borderSize={"3px"}
                backgroundColor={avatar.backgroundColor}
                borderColor={avatar.borderColor}
              />
            </div>
          </div>
        </>
      )}
      {segment === "create" && (
        <div className={styles.center}>
          <Link href="/welcome">
            <Image
              src="/images/logo.png"
              alt="Logo Crunchy Pong"
              width={50}
              height={50}
              title="Logo Crunchy Pong"
              className={styles.logo}
            />
          </Link>
          <h2 className={styles.title}>Crunchy Pong</h2>
        </div>
      )}
    </nav>
  );
}
