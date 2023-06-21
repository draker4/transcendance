import { useEffect, useRef, useCallback } from "react";
import styles from "@/styles/navbar/AvatarMenu.module.css";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import Profile from "@/services/Profile.service";

type Props = {
  profile: Profile;
  setIsDropdownOpen: Function;
};

export default function NavbarHome({ profile, setIsDropdownOpen }: Props) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const signoff = useCallback(
    async (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      deleteCookie("crunchy-token");
      router.push("/welcome");
    },
    [router]
  );

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, [setIsDropdownOpen]);

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
  }, [closeDropdown]);

  return (
    <div className={styles.dropdown}>
      <ul className={styles.list}>
        <Link href={`/home/profile/${profile.login}`}>
          <li onClick={closeDropdown} className={styles.profile}>
            {profile.login}
          </li>
        </Link>
        <li onClick={signoff} className={styles.logOut}>
          Log Out
        </li>
      </ul>
    </div>
  );
}