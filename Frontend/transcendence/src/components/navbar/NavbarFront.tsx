"use client";
import { useSelectedLayoutSegment } from "next/navigation";
import styles from "@/styles/navbar/Navbar.module.css";
import Theme from "../theme/Theme";
import NavbarLogo from "./NavbarLogo";
import NavbarLogInBtn from "./NavbarLogInBtn";
import AvatarMenu from "./AvatarMenu";

type Props = {
  avatar: Avatar;
  profile: Profile;
};

export default async function NavbarFront({ avatar, profile }: Props) {
  const segment = useSelectedLayoutSegment();
  if (segment == "welcome") {
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
  return (
    <header>
      <nav className={styles.nav}>
        <NavbarLogo link="/home" />
        <div className={styles.right}>
          <Theme />
          <AvatarMenu avatar={avatar} profile={profile} />
        </div>
      </nav>
    </header>
  );
}
