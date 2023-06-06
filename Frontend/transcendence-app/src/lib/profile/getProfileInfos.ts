import Profile from "@/services/Profile.service";
import { CryptoService } from "@/services/crypto/Crypto.service";

const	Crypto = new CryptoService();

export const getProfileByToken = async (token: string): Promise<Profile> => {
	
	const	profile = await fetch("http://backend:4000/api/users", {
		method: "GET",
		headers: {"Authorization": "Bearer " + token},
	});

	if (!profile.ok) {
		throw new Error("Profil cannot be found");
	}

	const	data: Profile = await profile.json();

	data.login = (await Crypto.decrypt(data.login)).toString();
	data.first_name = (await Crypto.decrypt(data.first_name)).toString();
	data.last_name = (await Crypto.decrypt(data.last_name)).toString();
	data.email = (await Crypto.decrypt(data.email)).toString();
	data.phone = (await Crypto.decrypt(data.phone)).toString();
	data.image = (await Crypto.decrypt(data.image)).toString();
	return data;
}
