import fetchClientSide from "@/lib/fetch/fetchClientSide";
import styles from "@/styles/profile/TfaComponent.module.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";

export default function SectionCustom({ profile }: {
	profile: Profile
}) {

	const	router = useRouter();
	const	[notif, setNotif] = useState<string>('');
	const	[notifPopup, setNotifPopup] = useState<string>('');
	const	[code, setCode] = useState<string>('');
	const	[popup1, setPopup1] = useState<boolean>(false);
	const	[popup2, setPopup2] = useState<string>('');
	const	[popup3, setPopup3] = useState<boolean>(false);
	const	[tfa, setTfa] = useState<boolean>(profile.isTwoFactorAuthenticationEnabled ? profile.isTwoFactorAuthenticationEnabled : false);


	const	activate2fa = async () => {
		if (!popup1) {
			const	res = await fetchClientSide(`http://${process.env.HOST_IP}:4000/api/2fa/sendCode`, {
				method: "POST",
			});

			if (!res.ok)
				throw new Error("fetch error");
			
			setPopup1(true);
			return ;
		}

		if (popup1) {
			const	res = await fetchClientSide(`http://${process.env.HOST_IP}:4000/api/2fa/verifyCode/${code.toUpperCase()}`, {
				method: 'POST',
			})

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

			const	resGenerate = await fetchClientSide(`http://${process.env.HOST_IP}:4000/api/2fa/generate`, {
				method: "POST",
			});

			if (!resGenerate.ok)
				throw new Error("fetch error");

			const	dataGenerate = await resGenerate.json();
			
			setPopup2(dataGenerate.otpauthUrl);
			setCode('');
		}
	}

	const	deactivate2fa = async () => {
		setPopup3(true);
	}

	const	handleDoubleAuth = async () => {
		setNotif('');

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
		try {
			const	res = await fetchClientSide(`http://${process.env.HOST_IP}:4000/api/2fa/activate/${code.toUpperCase()}`, {
				method: "POST",
			});

			if (!res.ok)
				throw new Error('error fetch');
			
			const	data = await res.json()

			if (!data.success && data.error == 'wrong code') {
				setNotifPopup('Wrong Authentification Code');
				return ;
			}

			setTfa(true);
			setPopup2('');
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

	const	deactivateCode2fa = async () => {
		setNotif('');
		try {
			const	res = await fetchClientSide(`http://${process.env.HOST_IP}:4000/api/2fa/deactivate/${code.toUpperCase()}`, {
				method: "POST",
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
			setNotif('Something went wrong, please try again!');
		}
	}

	const	closePopup = () => {
		setPopup2('');
		setPopup3(false);
	}

	return (
		<div className={styles.main}>
			<p>
				Protect your Crunchy account with an extra layer of security. Once set up, you will need to enter both your password and an authentication code from your phone to log in.
			</p>

			{
				popup1 &&
				<div className={styles.popup1}>
					<p>
						Please enter the code you get by email to verify your identity:
					</p>
					<input
						type="text"
						name="code"
						maxLength={8}
						onChange={(e) => {
							setCode(e.target.value);
						}}
					/>
				</div>
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
				popup2.length > 0 &&
				<div className={styles.popup2}>
					<div className={styles.icon}>
						<FontAwesomeIcon
							icon={faXmark}
							style={{width:"100%", height:"100%"}}
							onClick={closePopup}
						/>
					</div>
					<p>
						Download an authentification application like <span>Authy</span> or <span>Google Authenticator</span> on your phone.
					</p>
					<p>
						Open the app and scan this QR Code!
					</p>
					<div className={styles.qrcode}>
						<QRCode
							style={{ height: "auto", maxWidth: "100%", width: "100%" }}
							value={popup2}
						/>
					</div>
					<p>
						Now you can securely connect with your phone!
					</p>
					<p>
						Enter here the authentification code that was generated in the app:
					</p>
					<input
						type="text"
						name="code"
						maxLength={6}
						onChange={(e) => {
							setCode(e.target.value);
						}}
					/>
					<button className={styles.activate} onClick={activateCode2fa}>
						Activate
					</button>

					{
						notifPopup.length > 0 &&
						<div className={styles.notif}>{notifPopup}</div>
					}

				</div>
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

		</div>
	)
}
