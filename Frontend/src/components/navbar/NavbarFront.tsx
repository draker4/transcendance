"use client";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import styles from "@/styles/navbar/Navbar.module.css";
import Theme from "../theme/Theme";
import NavbarLogo from "./NavbarLogo";
import NavbarLogInBtn from "./NavbarLogInBtn";
import AvatarMenu from "./AvatarMenu";
import Link from "next/link";
import ChatBtn from "./ChatBtn";
import NavbarLogOutBtn from "./NavbarLogOutBtn";

type Props = {
  avatar: Avatar | undefined;
  profile: Profile | undefined;
  token: string | undefined;
};

export default function NavbarFront({ avatar, profile, token }: Props) {
  const segment = useSelectedLayoutSegment();
  const pathName = usePathname();

  if (segment === "welcome") {
    return (
      <header>
        <nav className={styles.nav}>
          <NavbarLogo link="/welcome" />
          <div className={styles.right}>
            <Theme />
            <NavbarLogInBtn />
          </div>
        </nav>
      </header>
    );
  }

  if (pathName === "/home/auth/2fa" && profile) {
    return (
      <header>
        <nav className={styles.nav}>
          <NavbarLogo link="/welcome" />
          <div className={styles.right}>
            <Theme />
            <NavbarLogOutBtn profile={profile}/>
          </div>
        </nav>
      </header>
    );
  }

  if (!profile || !profile.login || !avatar)
    return (
      <header>
        <nav className={styles.nav}>
          <NavbarLogo link="/home" />
          <div>
            <Theme />
          </div>
        </nav>
      </header>
    );

  return (
    <header>
      <nav className={styles.nav}>
        <NavbarLogo link="/home" />
        <div className={styles.right}>
          <Theme />
          <Link href={"/home/chat"} className={styles.chatBtn}>
            <ChatBtn token={token} />
          </Link>
          <AvatarMenu avatar={avatar} profile={profile} />
        </div>
      </nav>
    </header>
  );
}
