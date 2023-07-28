import styles from "@/styles/navbar/Navbar.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavbarLogOutBtn({ profile }: {
	profile: Profile;
}) {

	const	router = useRouter();

	const signoff = async () => {
		try {
			await fetch(
			`http://${process.env.HOST_IP}:3000/api/signoff?id=${profile.id}`
			);
			router.refresh();
		} catch (error) {
			console.log(error);
		}
	};

  return (
    <Link href="/welcome" className={styles.logIn}>
      <button
	  	type="button"
		title="Log out Button"
		className={styles.logInBtn}
		onClick={signoff}
		>
        Log Out
      </button>
    </Link>
  );
}
