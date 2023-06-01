"use client"

import { getDoubleLogin, getDoubleEmail, checkPassword } from "@/lib/auth/checkUserInscription";
import styles from "@/styles/SignUp.module.css"
import { useRouter } from "next/navigation";
import React, { useState } from "react";
// import { emailer } from "@/services/Emailer.service";

export default function SignUpPage() {

	const	router = useRouter();
	const	[emailUsed, setEmailUsed] = useState<boolean>(false);
	const	[loginUsed, setLoginUsed] = useState<string>("");
	const	[passWordSecured, setPasswordSecured] = useState<string>("");

	const   open42 = () => {
        window.open(process.env.URL_42, "_self");
    }

	const	signin = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		router.push("/signin");
	}

	const	submit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		const	target = e.target as typeof e.target & {
			email: { value: string };
			login: { value: string };
			password: { value: string };
		}

		try {
			const	checkEmail = await getDoubleEmail(target.email.value);
			const	checkLogin = await getDoubleLogin(target.login.value);
			const	passWordSecured = checkPassword(target.password.value);
			console.log(checkLogin);
			setEmailUsed(checkEmail);
			setLoginUsed(checkLogin);
			setPasswordSecured(passWordSecured);

			if (checkEmail || checkLogin.length > 0 || passWordSecured.length > 0)
				throw new Error("Not valable user");
			
			// emailer.verifyUserInscription(target.email.value, target.email.value);
			// await client.logInEmail(target.email.value, target.login.value, target.password.value);
			router.push("api/auth");
		}
		catch (err) {
			console.log(err);
		}
	}

	return (
		<div onSubmit={submit} className={styles.main}>
			<div className={styles.box}>
				<p className={styles.welcome}>Welcome</p>
				<form className={styles.form}>
					<input type="text" aria-label="Username" autoComplete="username" placeholder="login" name="login" className={styles.input} required/>
					{ loginUsed.length > 0 && <div>{ loginUsed }!</div> }
					<input type="email" autoComplete="username" placeholder="email" name="email" className={styles.input} required/>
					{ emailUsed && <div>Email already used !</div> }
					<input type="password" autoComplete="new-password" placeholder="password" name="password" className={styles.input} required/>
					{ passWordSecured.length > 0 && <div>{ passWordSecured }</div> }
					<button type="submit" className={styles.continue}>Continue</button>
				</form>
				<p className={styles.signUp}>Already have an account? <span onClick={signin}>Sign in</span></p>
				<p className={styles.or}>Or</p>
				<div className={styles.buttons}>
					<button onClick={open42} className={styles.buttonLogin}>Login with 42</button>
					<button onClick={open42} className={styles.buttonLogin}>Login with Google</button>
				</div>
			</div>
		</div>
	);
}
