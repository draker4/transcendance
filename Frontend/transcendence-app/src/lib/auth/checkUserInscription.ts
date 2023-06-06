export async function getDoubleEmail(email: string): Promise<boolean> {
	const	encodeEmail = encodeURIComponent(email);
	const	response = await fetch(`http://backend:4000/api/users/email?email=${encodeEmail}`);

	if (!response.ok)
		throw new Error("Cannot check if email is already used");
	
	const	data = await response.json();
	return data.exists as boolean;
}

export async function getDoubleLogin(login: string): Promise<string> {
	const	encodeLogin = encodeURIComponent(login);
	const	response = await fetch(`http://backend:4000/api/users/login?login=${encodeLogin}`);

	if (!response.ok)
		throw new Error("Cannot check if login is already used");
	
	const	data = await response.json();
	if (data.exists)
		return "Login already used!"

	return "";
}

export function checkLoginFormat(login: string): string {
	if (/[ ]/.test(login))
		return "The login must not contain any space";
	if (/["']/.test(login))
		return "The password must not contain any quote";
	if (login.length < 6)
		return "The login must conatain at least 6 characters";
	return "";
}

export function checkPassword(password: string): string {
	if (/[ ]/.test(password))
		return "The password must not contain any space";
	if (/["']/.test(password))
		return "The password must not contain any quote";
	if (password.length < 8
		|| !/[A-Z]/.test(password)
		|| !/[0-9]/.test(password)
		|| !/[!@#$%^&*(),.?:{}|<>]/.test(password)
	)
		return "The password must contain at least 8 characters, with one capital letter, one digit and one special character";
	return "";
}
