export const getAvatarByLogin = async (token: string, login: string) => {
	
	const	avatar = await fetch(`http://backend:4000/api/avatar/${login}`, {
		method: "GET",
		headers: {"Authorization": "Bearer " + token},
	});

	if (!avatar.ok) {
		throw new Error("Avatar cannot be found");
	}

	const	data = await avatar.json();
	return data;
}