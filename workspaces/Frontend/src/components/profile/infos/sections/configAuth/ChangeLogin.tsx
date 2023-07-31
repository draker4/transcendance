import styles from "@/styles/profile/ChangeLogin.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import stylesButton from "@/styles/profile/TfaComponent.module.css";
import { useRouter } from "next/navigation";
import fetchClientSide from "@/lib/fetch/fetchClientSide";
import { Socket } from "socket.io-client";

export default function ChangeLogin({
	setChangeLogin,
	setLogin,
	setSuccess,
	socket,
}: {
	setChangeLogin: Dispatch<SetStateAction<boolean>>;
	setLogin: Dispatch<SetStateAction<string>>;
	setSuccess: Dispatch<SetStateAction<boolean>>;
	socket: Socket | undefined;
}) {

	const	[loginText, setLoginText] = useState<string>("");
	const	[textButton, setTextButton] = useState<string>("Validate");
	const	[notif, setNotif] = useState<string>("");
	const	router = useRouter();

	const	handleClick = async () => {
		setTextButton("Loading...");
		setNotif("");

		if (loginText.length < 4 || loginText.length > 20) {
			setNotif("The login must have between 4 and 20 characters");
			setTextButton("Validate");
			return ;
		}

		if (loginText.includes(' ')) {
			setNotif("The login must not contain any space");
			setTextButton("Validate");
			return ;
		}

		if (!(/^(?!.*(?:'|\"|`))[!-~À-ÿ]+/.test(loginText))) {
			setNotif("The login must not contains any quote");
			setTextButton("Validate");
			return ;
		}

		try {
			const	res = await fetchClientSide(
				`http://${process.env.HOST_IP}:4000/api/users/changeLogin`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						login: loginText,
					}),
				}
			);

			if (!res.ok)
				throw new Error('fetch failed');
			
			const	data = await res.json();
			
			if (!data.success) {
				if (data.error === "exists") {
					setNotif("This login already exists...");
					setTextButton("Validate");
					return ;
				}
			}

			if (data.success) {
				setChangeLogin(false);
				setTextButton("Validate");
				setLogin(loginText);
				setSuccess(true);

				if (socket)
					socket.emit('notif');

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

	return (
		<div className={styles.main}>
			<p>Choose my awesome new login:</p>
			<input
				type="text"
				name="login"
				maxLength={20}
				minLength={4}
				onChange={(e) => {
					setLoginText(e.target.value);
				}}
			/>

			<div className={stylesButton.flexButtons}>
				<button
					className={stylesButton.button}
					disabled={textButton !== "Validate"}
					onClick={handleClick}
				>
					{textButton}
				</button>
				<button
					className={stylesButton.button}
					onClick={() => setChangeLogin(false)}
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
		</div>
	)
}
