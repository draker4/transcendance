"use client"

import styles from "@/styles/SignIn.module.css"
import { useRouter } from "next/navigation";

export default function SignInPage() {

	const	router = useRouter();

	const   open42 = () => {
        window.open(process.env.URL_42, "_self");
    }

	const	signup = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		router.push("/welcome/signup");
	}

	return (
		<div className={styles.main}>
			<div className={styles.box}>
				<p className={styles.welcome}>Welcome Back</p>
				<form className={styles.form}>
					<input type="text" placeholder="login" className={styles.input}/>
					<button className={styles.continue}>Continue</button>
				</form>
				<p className={styles.signUp}>Don&apos;t have an account? <span onClick={signup}>Sign up</span></p>
				<p className={styles.or}>Or</p>
				<div className={styles.buttons}>
					<button onClick={open42} className={styles.buttonLogin}>Login with 42</button>
					<button onClick={open42} className={styles.buttonLogin}>Login with Google</button>
				</div>
			</div>
		</div>
	);
}
