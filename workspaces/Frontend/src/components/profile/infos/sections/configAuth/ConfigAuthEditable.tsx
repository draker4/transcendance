import stylesInfoCard from "@/styles/profile/InfoCard.module.css";
import TfaComponent from "./TfaComponent";
import styles from "@/styles/profile/TfaComponent.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import ChangeLogin from "./ChangeLogin";
import ChangePassword from "./ChangePassword";

export default function SectionCustom({ profile, setLogin }: {
	profile: Profile;
	setLogin: Dispatch<SetStateAction<string>>;
}) {

	const	[changeLogin, setChangeLogin] = useState<boolean>(false);
	const	[changePassword, setChangePassword] = useState<boolean>(false);

	return (
		<div>
		<p className={stylesInfoCard.tinyTitle}>Account Settings</p>
		
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
			/>
		}

		{
			profile.provider && profile.provider === "email" && !changePassword &&
			<button
				className={styles.button}
				style={{margin:"10px auto"}}
				onClick={() => setChangePassword(true)}
			>Change my Password</button>
		}

		{
			changePassword &&
			<ChangePassword
				setChangePassword={setChangePassword}
			/>
		}

		<TfaComponent profile={profile}/>

		</div>
	)
}
