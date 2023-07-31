import styles from "@/styles/profile/ChangeLogin.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import stylesButton from "@/styles/profile/TfaComponent.module.css";
import { useRouter } from "next/navigation";
import fetchClientSide from "@/lib/fetch/fetchClientSide";
import { CryptoService } from "@/services/crypto/Crypto.service";
import hash from "@/lib/bcrypt/hash";

const	Crypto = new CryptoService();

export default function ChangePassword({
	setChangePassword,
	setSuccess,
}: {
	setChangePassword: Dispatch<SetStateAction<boolean>>;
	setSuccess: Dispatch<SetStateAction<boolean>>;
}) {

	const	initalEmailPasswordText = "Forgot my password?";
	const	[password, setPassword] = useState<string>("");
	const	[verifyPassword, setVerifyPassword] = useState<string>("");
	const	[emailPassword, setEmailPassword] = useState<string>(initalEmailPasswordText);
	const	[newPassword, setNewPassword] = useState<boolean>(false);
	const	[textButton, setTextButton] = useState<string>("Validate");
	const	[notif, setNotif] = useState<string>("");
	const	router = useRouter();

	const	handleClick: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
	
		setNotif('');
		setTextButton("Loading...");

		if (!newPassword && password.length === 0) {
			setNotif('Please enter your current password.');
			setTextButton("Validate");
			return ;
		}

		if (newPassword && /[ ]/.test(password)) {
			setNotif("The password must not contain any space");
			setTextButton("Validate");
			return ;
		}
		
		if (newPassword && /["'`]/.test(password)) {
			setNotif("The password must not contain any quote");
			setTextButton("Validate");
			return ;
		}
		
		if (newPassword &&
			(password.length < 8
			|| !/[A-Z]/.test(password)
			|| !/[0-9]/.test(password)
			|| !/[!@#$%^&*(),.?:{}|<>]/.test(password))
		) {
			setNotif("The password must contain at least 8 characters, with one capital letter, one digit and one special character");
			setTextButton("Validate");
			return ;
		}

		try {
			if (!newPassword) {
				const	passwordCrypted = await Crypto.encrypt(password);

				const	res = await fetchClientSide(
					`http://${process.env.HOST_IP}:4000/api/users/checkPassword`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							password: passwordCrypted,
						}),
					}
				);

				if (!res.ok)
					throw new Error('fetch failed');
			
				const	data = await res.json();
			
				if (!data.success) {
					if (data.error === "wrong") {
						setNotif("Wrong password, try again!");
						setTextButton("Validate");
						return ;
					}
				}

				if (data.success) {
					setNewPassword(true);
					setTextButton("Validate");
					return ;
				}

				throw new Error("no success found");
			}

			if (password !== verifyPassword) {
				setVerifyPassword("");
				setNotif("Passwords do not match!");
				setTextButton("Validate");
				return ;
			}

			const	passwordHashed = await hash(verifyPassword);

			const	res = await fetchClientSide(
				`http://${process.env.HOST_IP}:4000/api/users/updatePassword`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						password: passwordHashed,
					}),
				}
			);

			if (!res.ok)
				throw new Error('fetch failed');
			
			const	data = await res.json();

			if (data.success) {
				setChangePassword(false);
				setTextButton("Validate");
				setSuccess(true);
				return ;
			}

			throw new Error("no success found");

		}
		catch (error: any) {
			console.log(error.message);
			if (error.message === "disconnect") {
				await fetch(
					`http://${process.env.HOST_IP}:3000/api/signoff`
				);
				router.refresh();
			}
			setNotif('Something went wrong, please try again!');
			setTextButton("Validate");
		}
	}

	const	handleEmailPassword = () => {

		if (emailPassword === initalEmailPasswordText) {
			setNotif('');
			setTextButton("Send new password by mail");
			setEmailPassword("You can get a new password by email. Click again to cancel.");
		}

		else {
			setTextButton("Validate");
			setEmailPassword(initalEmailPasswordText);
		}
	}

	return (
		<div className={styles.main}>
			
			<form onSubmit={handleClick}>
				<input
					type="text"
					name="email"
					autoComplete="username email"
					hidden={true}
				/>

				{
					!newPassword &&
					<>
						<p>Please enter your current password:</p>
						<input
							type="password"
							name="password"
							autoComplete="current-password"
							maxLength={350}
							minLength={4}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
					</>
				}

			{
				!newPassword &&
				<div className={styles.changePassword}>
					<p><span
						onClick={handleEmailPassword}
						>{emailPassword}</span></p>
				</div>
			}

			{
				newPassword &&
				<>
					<p>Choose my new password:</p>
					<input
						type="password"
						name="newPassword"
						autoComplete="new-password"
						maxLength={350}
						minLength={4}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>
					<p>Confirm password:</p>
					<input
						type="password"
						name="verifyPassword"
						autoComplete="new-password"
						maxLength={350}
						minLength={4}
						onChange={(e) => {
							setVerifyPassword(e.target.value);
						}}
					/>
				</>
			}

			<div className={stylesButton.flexButtons}>
				<button
					className={stylesButton.button}
					disabled={textButton === "Loading..." ? true : false}
					type="submit"
				>
					{textButton}
				</button>

				<button
					className={stylesButton.button}
					onClick={() => {
						setChangePassword(false);
					}}
				>
					Cancel
				</button>
			</div>

			{
				notif.length > 0 &&
				<p className={stylesButton.notif}>
					{notif}
				</p>
			}
			</form>
		</div>
	)
}
