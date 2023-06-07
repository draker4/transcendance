import registerForm from "@/lib/auth/registerForm";
import styles from "@/styles/Login.module.css"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function LogInComponent() {
	
	const	router = useRouter();
	const	[emailUsed, setEmailUsed] = useState<boolean>(false);
	// const	[loginUsed, setLoginUsed] = useState<string>("");
	const	[password, setPassword] = useState<boolean>(false);
	const	[passwordSecured, setPasswordSecured] = useState<string>("");
	const	[register, setRegister] = useState<boolean>(false);
	const	[title, setTitle] = useState<string>("Connection / Inscription");
	const	[notif, setNotif] = useState<string>("");
	const	{ executeRecaptcha } = useGoogleReCaptcha();

	useEffect(() => {
		if (register)
			router.push('welcome/signup/confirm');
	}, [register]);

	const   open42 = () => {
        window.open(process.env.URL_42, "_self");
    }

	const   openGoogle = async () => {
			window.location.href = "http://localhost:4000/api/auth/google";
    }

	const	signin = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		// router.push("/welcome/signin");
	}

	return (
		<div className={styles.main}>
			<p className={styles.title}>{ title }</p>
			<p>Enter your email to log in or register your account</p>
			<div className={styles.box}>

				<form action={async (data: FormData) => {
					if (!executeRecaptcha) {
						setNotif("Something went wrong, please try again!");
						return ;
					}

					try {

					const	token = await executeRecaptcha("enquiryFormSubmit");

					const	response = await fetch("http://localhost:3000/api/auth/captcha", {
						method: "POST",
						headers: {
							Accept: "applicattion/json, text/plain, */*",
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							gRecaptchaToken: token,
						})
					});

					const	notifCaptcha = (await response.json()).message;

					setNotif(notifCaptcha);
					if (notifCaptcha !== "") 
						return;
					
					const	res: {
						checkEmail: boolean,
						// checkLogin: string,
						passwordSecured: string,
						register: boolean,
					} = await registerForm(data);
					
					setEmailUsed(res.checkEmail);
					// setLoginUsed(res.checkLogin);
					setPasswordSecured(res.passwordSecured);
					setRegister(res.register);
				}
				catch (error) {
					console.log(error);
					setNotif("Something went wrong, please try again!");
				}

				}} className={styles.form}>
					{/* <input type="text" aria-label="Username" autoComplete="username" placeholder="login" name="login" className={styles.input} required/> */}
					{/* { loginUsed.length > 0 && <div>{ loginUsed }!</div> } */}
					<input type="email" autoComplete="username" placeholder="email" name="email" className={styles.input} required/>
					{ emailUsed && <div>Email already used !</div> }
					{ password &&
						<div>
							<input type="password" autoComplete="new-password" placeholder="password" name="password" className={styles.input} required/>
							{ passwordSecured.length > 0 && <div>{ passwordSecured }</div> }
						</div>
					}
					{ notif.length > 0 && <div>{ notif }</div>}
					<button type="submit" className={styles.continue}>Continue</button>
				</form>

				<p className={styles.or}>----- Or -----</p>
				<div className={styles.logButtons}>
					<img src="/images/auth/42_Logo.png" onClick={open42} className={styles.logImg}/>
				</div>
				{/* <div className={styles.buttons}>
					<button onClick={open42} className={styles.buttonLogin}>Login with 42</button>
					<button onClick={openGoogle} className={styles.buttonLogin}>Login with Google</button>
				</div> */}
			</div>
		</div>
	);
}
