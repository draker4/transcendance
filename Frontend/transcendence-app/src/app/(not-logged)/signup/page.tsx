"use client"

import registerForm from "@/lib/auth/registerForm";
import styles from "@/styles/SignUp.module.css"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SignUpPage() {

	const	router = useRouter();
	const	[emailUsed, setEmailUsed] = useState<boolean>(false);
	const	[loginUsed, setLoginUsed] = useState<string>("");
	const	[passwordSecured, setPasswordSecured] = useState<string>("");
	const	[register, setRegister] = useState<boolean>(false);

	useEffect(() => {
		if (register)
			router.push('signup/confirm');
	}, [register]);

	const   open42 = () => {
        window.open(process.env.URL_42, "_self");
    }

	const	signin = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		router.push("/signin");
	}

	return (
		<div className={styles.main}>
			<div className={styles.box}>
				<p className={styles.welcome}>Welcome</p>

				<form action={async (data: FormData) => {
					const	res: {
						checkEmail: boolean,
						checkLogin: string,
						passwordSecured: string,
						register: boolean,
					} = await registerForm(data);
					
					setEmailUsed(res.checkEmail);
					setLoginUsed(res.checkLogin);
					setPasswordSecured(res.passwordSecured);
					setRegister(register);
				}} className={styles.form}>
					<input type="text" aria-label="Username" autoComplete="username" placeholder="login" name="login" className={styles.input} required/>
					{ loginUsed.length > 0 && <div>{ loginUsed }!</div> }
					<input type="email" autoComplete="username" placeholder="email" name="email" className={styles.input} required/>
					{ emailUsed && <div>Email already used !</div> }
					<input type="password" autoComplete="new-password" placeholder="password" name="password" className={styles.input} required/>
					{ passwordSecured.length > 0 && <div>{ passwordSecured }</div> }
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
