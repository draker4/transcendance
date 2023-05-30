"use client"

import styles from "@/styles/SignUp.module.css"

export default function SignUpPage() {

	const   open42 = () => {
        window.open(process.env.URL_42, "_self");
    }

	return (
		<div className={styles.main}>
			<div className={styles.box}>
				<p className={styles.welcome}>Welcome</p>
				<form className={styles.form}>
					<input type="text" placeholder="login" className={styles.input} required/>
					<input type="password" placeholder="password" className={styles.input} required/>
					<input type="email" placeholder="email" className={styles.input} required/>
					<input type="tel" placeholder="phone" className={styles.input}/>
					<button className={styles.continue}>Continue</button>
				</form>
				<p className={styles.signUp}>Already have an account? <span>Sign in</span></p>
				<p className={styles.or}>Or</p>
				<div className={styles.buttons}>
					<button onClick={open42} className={styles.buttonLogin}>Login with 42</button>
					<button onClick={open42} className={styles.buttonLogin}>Login with Google</button>
				</div>
			</div>
		</div>
	);
}
