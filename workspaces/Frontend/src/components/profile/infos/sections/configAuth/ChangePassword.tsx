import styles from "@/styles/profile/ChangeLogin.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import stylesButton from "@/styles/profile/TfaComponent.module.css";
import { useRouter } from "next/navigation";
import fetchClientSide from "@/lib/fetch/fetchClientSide";

export default function ChangePassword({
	setChangePassword,
}: {
	setChangePassword: Dispatch<SetStateAction<boolean>>;
}) {

	const	initalEmailPasswordText = "Forgot my password?";
	const	[password, setPassword] = useState<string>("");
	const	[emailPassword, setEmailPassword] = useState<string>(initalEmailPasswordText);
	const	[textButton, setTextButton] = useState<string>("Validate");
	const	[notif, setNotif] = useState<string>("");
	const	router = useRouter();

	// const	handleClick = async () => {
	// 	setTextButton("Loading...");

	// 	if (loginText.length < 4 || loginText.length > 12) {
	// 		setNotif("The login must have between 4 and 12 characters");
	// 		setTextButton("Validate");
	// 		return ;
	// 	}

	// 	if (!(/^(?!.*(?:'|\"|`))[!-~À-ÿ]+/.test(loginText))) {
	// 		setNotif("The login must not contains any quote");
	// 		setTextButton("Validate");
	// 		return ;
	// 	}

	// 	try {
	// 		const	res = await fetchClientSide(
	// 			`http://${process.env.HOST_IP}:4000/api/users/changeLogin`, {
	// 				method: "PUT",
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 				},
	// 				body: JSON.stringify({
	// 					login: loginText,
	// 				}),
	// 			}
	// 		);

	// 		if (!res.ok)
	// 			throw new Error('fetch failed');
			
	// 		const	data = await res.json();
			
	// 		if (!data.success) {
	// 			if (data.error === "exists") {
	// 				setNotif("This login already exists...");
	// 				setTextButton("Validate");
	// 				return ;
	// 			}
	// 		}

	// 		if (data.success) {
	// 			setChangeLogin(false);
	// 			setTextButton("Validate");
	// 			setLogin(loginText);
	// 			return ;
	// 		}

	// 		throw new Error("no success found");

	// 	}
	// 	catch (error: any) {
	// 		console.log(error.message);
	// 		if (error.message === "disconnect") {
	// 			await fetch(
	// 				`http://${process.env.HOST_IP}:3000/api/signoff`
	// 			);
	// 			router.refresh();
	// 		}
	// 		setNotif('Something went wrong, please try again!');
	// 		setTextButton("Validate");
	// 	}
	// }

	const	handleEmailPassword = () => {

		if (emailPassword === initalEmailPasswordText) {
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
			
			<p>Please enter your current password:</p>
			<input
				type="password"
				name="login"
				maxLength={12}
				minLength={4}
				onChange={(e) => {
					setPassword(e.target.value);
				}}
			/>

			{
				// emailPassword.length === 0 &&
				<div className={styles.changePassword}>
					<p><span
						onClick={handleEmailPassword}
						>{emailPassword}</span></p>
				</div>
			}

			<button
				className={stylesButton.button}
				disabled={textButton !== "Validate"}
				// onClick={handleClick}
			>
				{textButton}
			</button>

			{
				notif.length > 0 &&
				<p className={stylesButton.notif}>
					{notif}
				</p>
			}
		</div>
	)
}
