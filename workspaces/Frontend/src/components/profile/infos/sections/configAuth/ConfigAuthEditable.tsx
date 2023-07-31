import stylesInfoCard from "@/styles/profile/InfoCard.module.css";
import TfaComponent from "./TfaComponent";
import styles from "@/styles/profile/TfaComponent.module.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ChangeLogin from "./ChangeLogin";
import ChangePassword from "./ChangePassword";

export default function SectionCustom({ profile, setLogin }: {
	profile: Profile;
	setLogin: Dispatch<SetStateAction<string>>;
}) {

	const	[changeLogin, setChangeLogin] = useState<boolean>(false);
	const	[changePassword, setChangePassword] = useState<boolean>(false);
	const	[success, setSuccess] = useState<boolean>(false);


	useEffect(() => {
		if (success)
			setTimeout(() => {
				setSuccess(false);
			}, 3000);
	}, [success]);

	return (
		<div>
			<p className={stylesInfoCard.tinyTitle}>Account Settings</p>

			{
				success &&
				<p className={styles.success}>Profile successfully updated!</p>
			}
			
			{
				!changeLogin &&
				<button
					className={styles.button}
					style={{margin:"10px auto"}}
					onClick={() => setChangeLogin(true)}
				>Change my login</button>
			}

			{
				changeLogin &&
				<ChangeLogin
					setChangeLogin={setChangeLogin}
					setLogin={setLogin}
					setSuccess={setSuccess}
				/>
			}

			{
				profile.provider && profile.provider === "email" && !changePassword &&
				<button
					className={styles.button}
					style={{margin:"10px auto"}}
					onClick={() => setChangePassword(true)}
				>Change my password</button>
			}

			{
				changePassword &&
				<ChangePassword
					setChangePassword={setChangePassword}
					setSuccess={setSuccess}
				/>
			}

			<TfaComponent profile={profile}/>

		</div>
	)
}
