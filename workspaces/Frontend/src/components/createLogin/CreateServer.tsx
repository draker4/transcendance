import Profile_Service from "@/services/Profile.service";
import { cookies } from "next/headers";
import fs from "fs";
import FormLogin from "./FormLogin";

export default async function CreateServer() {

	let profile: Profile = {
		id: -1,
		login: "",
		first_name: "",
		last_name: "",
		email: "",
		phone: "",
		image: "",
		provider: "",
		motto: "",
		story: "",
	};
	let token: string | undefined = "";
	let avatars: string[] = [];
	let avatarCrypted: string | undefined = undefined;

	try {
		token = cookies().get("crunchy-token")?.value;
		if (!token)
			throw new Error("No token value");

		const profileData = new Profile_Service(token);
		profile = await profileData.getProfileByToken();

		const directoryPath = "/home/workspaces/Frontend/public/images/avatars";
		avatars = fs.readdirSync(directoryPath);

		avatars = avatars.map((avatar) => {
			if (avatar.includes("avatar"))
				return "/images/avatars/" + avatar;
			return avatar;
		});

	} catch (err) {
		console.log(err);
	}

  	if (profile.provider === "42")
		avatarCrypted = profile.image;

	return (
		<div style={{ width: "100%", height: "100%" }}>
			<FormLogin token={token as string} avatars={avatars} avatarCrypted={avatarCrypted} />
		</div>
	);
}
