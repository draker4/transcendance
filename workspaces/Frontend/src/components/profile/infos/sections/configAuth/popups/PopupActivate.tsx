import styles from "@/styles/profile/TfaComponent.module.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";
import QRCode from "react-qr-code";

export default function PopupCodeEmail({
	closePopup,
	otpauthUrl,
	secret,
	setCode,
	notifPopup,
	activateCode2fa,
}: {
	closePopup: () => void;
	otpauthUrl: string;
	secret: string;
	setCode: Dispatch<SetStateAction<string>>;
	notifPopup: string;
	activateCode2fa: () => Promise<void>;
}) {

	return (
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
				value={otpauthUrl}
			/>
		</div>
		<p>
			Or enter this A2F key manually:
		</p>
		<p>{secret}</p>
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
			minLength={6}
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
	);
}
