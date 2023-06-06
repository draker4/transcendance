"use server"

import { CryptoService } from "@/services/crypto/Crypto.service";
import { checkLoginFormat, checkPassword, getDoubleEmail, getDoubleLogin } from "./checkUserInscription";
import registerUser from "./registerUser";
import hash from "../bcrypt/hash";

const	Crypto = new CryptoService();

export default async function registerForm(
	formdata: FormData
): Promise<{
	checkEmail: boolean,
	checkLogin: string,
	passwordSecured: string,
	register: boolean,
}> {
	const	email = formdata.get('email') as string;
	const	login = formdata.get('login') as string;
	const	password = formdata.get('password') as string;
	
	try {
		const	passwordSecured = checkPassword(password);
		
		const	passwordHashed = await hash(password);
		const	loginCrypt = await Crypto.encrypt(login);
		const	emailCrypt = await Crypto.encrypt(email);
		
		let	checkLogin = checkLoginFormat(login);
		if (checkLogin.length == 0)
		checkLogin = await getDoubleLogin(loginCrypt);
		
		const	checkEmail = await getDoubleEmail(emailCrypt);
		
		if (checkEmail || checkLogin.length > 0 || passwordSecured.length > 0)
			return {
				checkEmail,
				checkLogin,
				passwordSecured,
				register: false,
			};

		await registerUser(emailCrypt, loginCrypt, passwordHashed);
		
		return {
			checkEmail: false,
			checkLogin: "",
			passwordSecured: "",
			register: true,
		}
	}
	catch (err) {
		console.log(err);
	}

	return {
		checkEmail: false,
		checkLogin: "",
		passwordSecured: "",
		register: false,
	}
}
