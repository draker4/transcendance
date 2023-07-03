import { CryptoService } from "./crypto/Crypto.service";

const	Crypto = new CryptoService();

export default class Profile_Service {
	private token: string;

	// Instance singleton
	constructor(token: string) {
		this.token = token;
	}

	public async getProfileByToken(): Promise<Profile> {
	
		const	profile = await fetch("http://backend:4000/api/users/me", {
			method: "GET",
			headers: {"Authorization": "Bearer " + this.token},
		});

		if (!profile.ok) {
			throw new Error("Profil cannot be found");
		}

		const	data: Profile = await profile.json();

		data.first_name = (await Crypto.decrypt(data.first_name)).toString();
		data.last_name = (await Crypto.decrypt(data.last_name)).toString();
		data.email = (await Crypto.decrypt(data.email)).toString();
		data.phone = (await Crypto.decrypt(data.phone)).toString();
		data.image = (await Crypto.decrypt(data.image)).toString();

		return data;
	}

	public async getProfileByLogin (login: string): Promise<Profile> {
		const	profile = await fetch(`http://backend:4000/api/users/profile/${login}`, {
			method: "GET",
			headers: {"Authorization": "Bearer " + this.token},
		});

		if (!profile.ok) {
			throw new Error("Profil cannot be found");
		}

		const	data: Profile = await profile.json();

		data.first_name = (await Crypto.decrypt(data.first_name)).toString();
		data.last_name = (await Crypto.decrypt(data.last_name)).toString();
		data.email = (await Crypto.decrypt(data.email)).toString();
		data.phone = (await Crypto.decrypt(data.phone)).toString();
		data.image = (await Crypto.decrypt(data.image)).toString();

		return data;
	}

	public async getProfileWithAvatar(token:string, id: number)
		:Promise<Profile & { avatar: Avatar; }> {
	const profile = await fetch(`http://backend:4000/api/users/avatar/${id}`, {
		method: "GET",
		headers: {"Authorization": "Bearer " + token},
	});

	if (!profile.ok) {
		throw new Error("Profil with avatar cannot be found");
	}

	const data: Profile & { avatar: Avatar } = await profile.json();

	return data;
}
}
