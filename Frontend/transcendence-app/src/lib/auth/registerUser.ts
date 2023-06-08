export default async function registerUser(email: string, password: string) {
	const	response = await fetch("http://backend:4000/api/auth/register", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({
			email: email,
			passwordHashed: password,
			provider: "email",
		}),
	});

	if (!response.ok)
		throw new Error('Cannot create user');
}
