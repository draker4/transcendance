"use server"

import { CryptoService } from "@/services/crypto/Crypto.service";
import { checkPassword, getDoubleEmail } from "./checkUserInscription";
import registerUser from "./registerUser";
import hash from "../bcrypt/hash";

const	Crypto = new CryptoService();

export async function registerFormPassword(
	passwordUser: string,
	email: string,
): Promise<{
	passwordSecured: string,
	register: boolean,
}> {
	try {
		const	passwordSecured = checkPassword(passwordUser);
		const	emailCrypt = await Crypto.encrypt(email);

		if (passwordSecured.length > 0)
			return {
				passwordSecured,
				register: false,
		};

		const	passwordHashed = await hash(passwordUser);
		await registerUser(emailCrypt, passwordHashed);

		return {
			passwordSecured: "",
			register: true,
		}
	}
	catch (err) {
		return {
			passwordSecured: "",
			register: false,
		}
	}
}

export async function registerFormEmail(
	email: string,
): Promise<{
	emailExists: boolean,
	provider: string,
	notif: boolean,
}> {
	try {
		const	emailCrypt = await Crypto.encrypt(email);
		const	checkEmail = await getDoubleEmail(emailCrypt);

		return {
			emailExists: checkEmail.exists,
			provider: checkEmail.provider,
			notif: false,
		};
	}
	catch (err) {
		return {
			emailExists: false,
			provider: "",
			notif: true,
		};
	}
}
