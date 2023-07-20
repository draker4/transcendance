import styles from "@/styles/navbar/Navbar.module.css";
import Image from "next/image";
import Link from "next/link";

type Props = {
  link: string;
};

export default function NavbarLogo({ link }: Props) {
  return (
    <Link href={link}>
      <div className={styles.left}>
        <Image
          src="/images/icon.png"
          alt="Logo Crunchy Pong"
          width={50}
          height={50}
          title="Logo Crunchy Pong"
          className={styles.logo}
        />
        <h2 className={styles.title}>Crunchy Pong</h2>
      </div>
    </Link>
  );
}
