export const getAvatarByName = async (token: string, name: string, isChannel: boolean) => {
	
	const	avatar = await fetch(`http://backend:4000/api/avatar/${name}/${isChannel}`, {
		method: "GET",
		headers: {"Authorization": "Bearer " + token},
	});

	if (!avatar.ok) {
		throw new Error("Avatar cannot be found");
	}

	const	data = await avatar.json();
	return data;
}
