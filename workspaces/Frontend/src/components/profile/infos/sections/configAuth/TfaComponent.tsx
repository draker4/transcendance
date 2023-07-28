import fetchClientSide from "@/lib/fetch/fetchClientSide";
import styles from "@/styles/profile/TfaComponent.module.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QRCode from "react-qr-code";
import PopupCodeEmail from "./popups/PopupCodeEmail";
import PopupActivate from "./popups/PopupActivate";

export default function SectionCustom({ profile }: {
	profile: Profile
}) {

	const	router = useRouter();
	const	[notif, setNotif] = useState<string>('');
	const	[notifPopup, setNotifPopup] = useState<string>('');
	const	[code, setCode] = useState<string>('');
	const	[popup1, setPopup1] = useState<boolean>(false);
	const	[popup2, setPopup2] = useState<boolean>(false);
	const	[popup3, setPopup3] = useState<boolean>(false);
	const	[popup4, setPopup4] = useState<boolean>(false);
	const	[tfa, setTfa] = useState<boolean>(profile.isTwoFactorAuthenticationEnabled ? profile.isTwoFactorAuthenticationEnabled : false);
	const	[secret, setSecret] = useState<string>("");
	const	[otpauthUrl, setOtpauthUrl] = useState<string>("");

	const	activate2fa = async () => {
		setNotif('');
		setNotifPopup('');

		if (!popup1) {
			const	res = await fetchClientSide(`http://${process.env.HOST_IP}:4000/api/2fa/sendCode`);

			if (!res.ok)
				throw new Error("fetch error");
			
			setPopup1(true);
			return ;
		}

		if (popup1) {
			const	res = await fetchClientSide(`http://${process.env.HOST_IP}:4000/api/2fa/verifyCode`, {
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					code: code.toUpperCase()
				}),
			});

			if (!res.ok)
				throw new Error('error fetch');

			const	data = await res.json();

			if (!data.success) {
				if (data.error === "wrong code")
					setNotif("This code was not found, a new one has been sent to you!")
				if (data.error === "time out")
					setNotif("This code has expired, a new one has been sent to you!")
				return ;
			}

			setPopup1(false);

			const	resGenerate = await fetchClientSide(`http://${process.env.HOST_IP}:4000/api/2fa/generate`);

			if (!resGenerate.ok)
				throw new Error("fetch error");

			const	dataGenerate = await resGenerate.json();
			
			setSecret(dataGenerate.secret);
			setOtpauthUrl(dataGenerate.otpauthUrl);
			setPopup2(true);
			setCode('');
		}
	}

	const	deactivate2fa = async () => {
		setPopup3(true);
	}

	const	handleDoubleAuth = async () => {
		setNotif('');
		setNotifPopup('');

		try {
			if (!tfa)
				await activate2fa();
			else
				await deactivate2fa();
		}
		catch (error: any) {
			console.log(error.message);
			if (error.message === "disconnect") {
				await fetch(
					`http://${process.env.HOST_IP}:3000/api/signoff`
				);
				router.push("/welcome/notif");
			}
			setNotif('Something went wrong, please try again!');
		}
	}

	const	activateCode2fa = async () => {
		setNotif('');
		setNotifPopup('');

		if (code.length !== 6) {
			setNotifPopup("The code should have six characters");
			return ;
		}

		try {
			const	res = await fetchClientSide(`http://${process.env.HOST_IP}:4000/api/2fa/activate`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					twoFactorAuthenticationCode: code.toUpperCase(),
				}),
			});

			if (!res.ok)
				throw new Error('error fetch');
			
			const	data = await res.json()

			if (!data.success && data.error == 'wrong code') {
				setNotifPopup('Wrong Authentification Code');
				return ;
			}

			setTfa(true);
			setPopup2(false);
			setPopup4(true);
		}
		catch (error: any) {
			console.log(error.message);
			if (error.message === "disconnect") {
				await fetch(
					`http://${process.env.HOST_IP}:3000/api/signoff`
				);
				router.push("/welcome/notif");
			}
			setNotifPopup('Something went wrong, please try again!');
		}
	}

	const	deactivateCode2fa = async () => {
		setNotif('');
		setNotifPopup('');

		if (code.length !== 6) {
			setNotifPopup("The code should have six characters");
			return ;
		}

		try {
			const	res = await fetchClientSide(`http://${process.env.HOST_IP}:4000/api/2fa/deactivate`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					twoFactorAuthenticationCode: code.toUpperCase(),
				}),
			});

			if (!res.ok)
				throw new Error('error fetch');
			
			const	data = await res.json()

			if (!data.success && data.error == 'wrong code') {
				setNotifPopup('Wrong Authentification Code');
				return ;
			}

			setTfa(false);
			setPopup3(false);
		}
		catch (error: any) {
			console.log(error.message);
			if (error.message === "disconnect") {
				await fetch(
					`http://${process.env.HOST_IP}:3000/api/signoff`
				);
				router.push("/welcome/notif");
			}
			setNotifPopup('Something went wrong, please try again!');
		}
	}

	const	closePopup = () => {
		setPopup2(false);
		setPopup3(false);
		setPopup4(false);
	}

	const	downloadCodes = () => {
		setNotif('');
		setNotifPopup('');
	}

	return (
		<div className={styles.main}>
			<p>
				Protect your Crunchy account with an extra layer of security. Once set up, you will need to enter both your password and an authentication code from your phone to log in.
			</p>

			{
				popup1 &&
				<PopupCodeEmail setCode={setCode} />
			}

			<button onClick={handleDoubleAuth} className={styles.button}>
				{
					popup1
					? "Send code"
					: tfa
					? "Deactivate Double Authentification"
					: "Activate Double Authentification"
				}
			</button>

			{
				notif.length > 0 &&
				<p className={styles.notif}>{notif}</p>
			}

			{
				popup2 &&
				<PopupActivate
					closePopup={closePopup}
					otpauthUrl={otpauthUrl}
					secret={secret}
					setCode={setCode}
					notifPopup={notifPopup}
					activateCode2fa={activateCode2fa}
				/>
			}

			{
				popup3 &&
				<div className={styles.popup2}>
					<div className={styles.icon}>
						<FontAwesomeIcon
							icon={faXmark}
							style={{width:"100%", height:"100%"}}
							onClick={closePopup}
						/>
					</div>
					<p>
						Please enter the code generated in the authentifiaction application in your phone.
					</p>
					<input
						type="text"
						name="code"
						maxLength={6}
						minLength={6}
						onChange={(e) => {
							setCode(e.target.value);
						}}
					/>
					<button className={styles.activate} onClick={deactivateCode2fa}>
						Deactivate
					</button>
					{
						notifPopup.length > 0 &&
						<div className={styles.notif}>{notifPopup}</div>
					}
				</div>
			}

			{
				popup4 &&
				<div className={styles.popup2}>
					<div className={styles.icon}>
						<FontAwesomeIcon
							icon={faXmark}
							style={{width:"100%", height:"100%"}}
							onClick={closePopup}
						/>
					</div>
					<h4>
						Here what you can do if you loose your authentification application!
					</h4>
					<p>
						Download your backup codes!
					</p>
					<p>
						Without them you could definitely loose your account!
					</p>
					<button className={styles.activate} onClick={downloadCodes}>
						Download my codes
					</button>

					{
						notifPopup.length > 0 &&
						<div className={styles.notif}>{notifPopup}</div>
					}

				</div>
			}

		</div>
	)
}
