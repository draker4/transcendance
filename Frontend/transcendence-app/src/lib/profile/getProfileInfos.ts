import Profile from "@/services/Profile.service";

export const getProfileByToken = async (token: string): Promise<Profile> => {
	
	const	profil = await fetch("http://backend:4000/api/users", {
		method: "GET",
		headers: {"Authorization": "Bearer " + token},
	});

	if (!profil.ok) {
		throw new Error("Profil cannot be found");
	}

	return await profil.json();
}
