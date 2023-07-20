import { CryptoService } from "@/services/crypto/Crypto.service";
import { checkPassword, getDoubleEmail } from "./checkUserInscription";
import registerUser from "./registerUser";
import hash from "../bcrypt/hash";
import logUserEmail from "./logUserEmail";

const	Crypto = new CryptoService();

export async function loginPassword(
	passwordUser: string,
	email: string,
): Promise<{
	passwordSecured: string,
	register: boolean,
	login: string,
}> {
	try {
		const	passwordSecured = checkPassword(passwordUser);
		
		if (passwordSecured.length > 0)
		return {
			passwordSecured: passwordSecured,
			register: false,
			login: "",
		};

		const	emailCrypt = await Crypto.encrypt(email);
	
		const	passwordCrypt = await Crypto.encrypt(passwordUser);
		const	res = await logUserEmail(emailCrypt, passwordCrypt);

		if (res === "wrong password") {
			return {
				passwordSecured: "Wrong password, please try again!",
				register: false,
				login: "",
			}
		}
		if (res === "no user") {
			const	passwordHashed = await hash(passwordUser);
			const	res = await registerUser(emailCrypt, passwordHashed);

			if (res.message !== "ok")
				throw new Error('Cannot create user');
			
			return {
				passwordSecured: "",
				register: true,
				login: "",
			}
		}
		if (res === "user not verified") {
			return {
				passwordSecured: "",
				register: true,
				login: "",
			}
		}
		if (res === "server error" || !res.access_token) {
			throw new Error("server error");
		}
		
		return {
			passwordSecured: "",
			register: false,
			login: res.access_token + " " + res.refresh_token,
		}
	}
	catch (err) {
		return {
			passwordSecured: "Something went wrong, please try again!",
			register: false,
			login: "",
		}
	}
}

export async function registerFormPassword(
	passwordUser: string,
	email: string,
): Promise<{
	passwordSecured: string,
	register: boolean,
	login: string,
}> {
	try {
		const	passwordSecured = checkPassword(passwordUser);
		const	emailCrypt = await Crypto.encrypt(email);

		if (passwordSecured.length > 0)
			return {
				passwordSecured,
				register: false,
				login: "",
			};
			
		const	passwordHashed = await hash(passwordUser);
		const	res = await registerUser(emailCrypt, passwordHashed);

		if (res.message !== "ok")
			throw new Error('Cannot create user');
		
		return {
			passwordSecured: "",
			register: true,
			login: "",
		}
	}
	catch (err) {
		return {
			passwordSecured: "",
			register: false,
			login: "",
		}
	}
}

export async function registerFormEmail(
	email: string,
): Promise<{
	emailExists: boolean,
	notif: boolean,
}> {
	try {
		const	emailCrypt = await Crypto.encrypt(email);
		const	checkEmail = await getDoubleEmail(emailCrypt);

		return {
			emailExists: checkEmail.exists,
			notif: false,
		};
	}
	catch (err) {
		return {
			emailExists: false,
			notif: true,
		};
	}
}
