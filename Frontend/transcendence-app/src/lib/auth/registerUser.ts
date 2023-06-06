export default async function registerUser(email: string, login: string, password: string) {
	const	response = await fetch("http://backend:4000/api/auth/register", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({
			email: email,
			login: login,
			password: password,
			provider: "email",
		}),
	});

	if (!response.ok)
		throw new Error('Cannot create user');
}
