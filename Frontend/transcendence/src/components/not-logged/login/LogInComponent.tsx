import { loginPassword, registerFormEmail, registerFormPassword } from "@/lib/auth/registerForm";
import styles from "@/styles/auth/Login.module.css"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setCookie } from "cookies-next";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function LogInComponent() {
	
	const	test = useParams().notif;
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
			router.push('welcome/confirm');

		if (test === "wrong")
			setNotif("Something went wrong, please try again!");

	}, [register, login]);

	const   open42 = () => {
		setTextButton("Loading...");
        window.open(process.env.URL_42, "_self");
    }

	const   openGoogle = async () => {
		
		setTextButton("Loading...");
		window.open("http://localhost:4000/api/auth/google", "_self");
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
		setPasswordSecured("");
		setTextButton("Continue");
		setPassword(false);
		exists.current = false;
		return ;
	}

	const	handleAction = async (data: FormData) => {

		try {

			await handleCaptcha();

			// handle input
			const	emailUser = data.get('email') as string;

			//if email, first step of authentification
			if (emailUser) {
				setEmail(emailUser);

				const	res: {
					emailExists: boolean,
					notif: boolean,
				} = await registerFormEmail(emailUser);
				console.log(res);
				if (res.notif)
					throw new Error();
				
				setPassword(true);
				setChangeEmail(true);
				
				if (res.emailExists)
					exists.current = true;
				
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
			<p className={styles.subtitle}>Enter your email to log in or register your account</p>
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

					<div className={password ? styles.openPassword : styles.closePassword}>
						<input type="password" autoComplete="new-password" placeholder="password" name="password"
							className={styles.input} required={password}/>
						{ passwordSecured.length > 0 && <div className={styles.notif}>{ passwordSecured }</div> }
					</div>

					{ notif.length > 0 && <div className={styles.notif}>{ notif }</div>}
					
					<button type="submit" disabled={textButton === "Loading..."} className={styles.continue}>{ textButton }</button>
				</form>

				<div className={styles.or}>
					<p><span>Or</span></p>
				</div>

				<p className={styles.oneClick}>Connect or register in one click</p>

				<div className={styles.logButtons}>
					<div className={styles.logImg}  onClick={open42}>
						<Image alt="42 school logo" src="/images/auth/42_Logo.png" width={30} height={30}/>
					</div>
					<div className={styles.logImg}  onClick={openGoogle}>
						<Image alt="google logo" src="/images/auth/google.png" width={30} height={30}/>
					</div>
				</div>
			</div>
		</div>
	);
}
