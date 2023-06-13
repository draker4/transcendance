import { loginPassword, registerFormEmail, registerFormPassword } from "@/lib/auth/registerForm";
import styles from "@/styles/auth/Login.module.css"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function LogInComponent() {
	
	const	router = useRouter();
	const	[email, setEmail] = useState<string>("");
	const	[password, setPassword] = useState<boolean>(false);
	const	[textButton, setTextButton] = useState<string>("Continue");
	const	[passwordSecured, setPasswordSecured] = useState<string>("");
	const	[register, setRegister] = useState<boolean>(false);
	const	[login, setLogin] = useState<string>("");
	const	[notif, setNotif] = useState<string>("");
	const	[changeEmail, setChangeEmail] = useState<boolean>(false);
	const	{ executeRecaptcha } = useGoogleReCaptcha();
	let		exists = useRef<boolean>(false);

	useEffect(() => {
		if (login.length > 0) {
			setCookie("crunchy-token", login);
			router.push("/home");
		}
		if (register)
			router.push('welcome/login/confirm');
	}, [register, login]);

	const   open42 = () => {
        window.open(process.env.URL_42, "_self");
    }

	const   openGoogle = async () => {
			window.location.href = "http://localhost:4000/api/auth/google";
    }

	const	handleCaptcha = async () => {

		if (!executeRecaptcha) {
			throw new Error('Captcha not ready');
		}

		const	token = await executeRecaptcha("enquiryFormSubmit");

		const	response = await fetch("http://localhost:3000/api/auth/captcha", {
			method: "POST",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				gRecaptchaToken: token,
			})
		});

		const	notifCaptcha = await response.json();

		if (notifCaptcha?.status !== "ok") 
			throw new Error();
	}

	const	iconEmail = () => {
		setEmail("");
		setNotif("");
		setTextButton("Continue");
		setPassword(false);
		exists.current = false;
		return ;
	}

	const	handleAction = async (data: FormData) => {

		if (textButton !== "Continue") {
			iconEmail();
			return ;
		}

		try {

			await handleCaptcha();

			// handle input
			const	emailUser = data.get('email') as string;

			//if email, first step of authentification
			if (emailUser) {
				setEmail(emailUser);

				const	res: {
					emailExists: boolean,
					provider: string,
					notif: boolean,
				} = await registerFormEmail(emailUser);

				if (res.notif)
					throw new Error();
				
				if (!res.emailExists) {
					setPassword(true);
					setChangeEmail(true);
					return;
				}

				if (res.provider === "email") {
					exists.current = true;
					setPassword(true);
					setChangeEmail(true);
				}
	
				else if (res.provider === "42") {
					setNotif("Please register with your 42 account!");
					setTextButton("Change email");
				}
				
				else if (res.provider === "google") {
					setNotif("Please register with your google account!");
					setTextButton("Change email");
				}
				return ;
			}

			const	passwordUser = data.get('password') as string;
			let		res:  {
				passwordSecured: string,
				register: boolean,
				login: string,
			} = { passwordSecured: "", register: false, login: "" };

			if (!exists)
				res = await registerFormPassword(passwordUser, email);
			else
				res = await loginPassword(passwordUser, email);

			setPasswordSecured(res.passwordSecured);

			if (register || login)
				setTextButton("Loading...");
			setRegister(res.register);
			setLogin(res.login);
		}
		catch (error) {
			setNotif("Something went wrong, please try again!");
		}
	}

	return (
		<div className={styles.main}>
			<p className={styles.title}>Connection / Inscription</p>
			<p>Enter your email to log in or register your account</p>
			<div className={styles.box}>

				<form action={handleAction} className={styles.form}>
					{ email.length === 0 && 
						<input type="email" autoComplete="username" placeholder="email" name="email" className={styles.input} required/>
					}
					{
						email.length > 0 &&
						<div className={styles.email}>
							{ email }
							{ changeEmail &&
							<div onClick={iconEmail}>
								<FontAwesomeIcon icon={faPenToSquare} />
							</div>}
						</div>
					}
					{ password &&
						<div>
							<input type="password" autoComplete="username" placeholder="password" name="password" className={styles.input} required/>
							{ passwordSecured.length > 0 && <div className={styles.notif}>{ passwordSecured }</div> }
						</div>
					}
					{ notif.length > 0 && <div className={styles.notif}>{ notif }</div>}
					<button type="submit" className={styles.continue}>{ textButton }</button>
				</form>

				<div className={styles.or}>
					<p><span>Or</span></p>
				</div>

				<p className={styles.oneClick}>Connect or register in one click</p>

				<div className={styles.logButtons}>
					<div className={styles.logImg}  onClick={open42}>
						<img src="/images/auth/42_Logo.png" width="30px"/>
					</div>
					<div className={styles.logImg}  onClick={openGoogle}>
						<img src="/images/auth/google.png" width="30px"/>
					</div>
				</div>
			</div>
		</div>
	);
}
