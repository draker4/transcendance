export async function getDoubleEmail(email: string): Promise<boolean> {
	const	encodeEmail = encodeURIComponent(email);
	const	response = await fetch(`http://localhost:4000/api/users/email?email=${encodeEmail}`);

	if (!response.ok && response.status != 401)
		throw new Error("Cannot check if email is already used");
	
	const	data = await response.json();
	return data.exists as boolean;
}

export async function getDoubleLogin(login: string): Promise<string> {
	if (/[ ]/.test(login))
		return "The login must not contain any space";

	const	encodeLogin = encodeURIComponent(login);
	const	response = await fetch(`http://localhost:4000/api/users/login?login=${encodeLogin}`);

	if (!response.ok && response.status != 401)
		throw new Error("Cannot check if login is already used");
	
	const	data = await response.json();
	if (data.exists)
		return "Login already used!"

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
		return "The password must contain at least one capital letter, one digit, one special character, and more than 8 characters";
	return "";
}
