import { getProfileByToken } from "@/lib/profile/getProfileInfos";
import Profile from "@/services/Profile.service";
import { cookies } from 'next/dist/client/components/headers';
import fs from 'fs';
import FormLogin from "@/components/logged-in/create/FormLogin";

export default async function CreatePage() {
	
	let	profile = new Profile();
	let	token: string | undefined = "";

	try {
		token = cookies().get("crunchy-token")?.value;
		if (!token)
			throw new Error("No token value");
	  
	  profile = await getProfileByToken(token);
	}
	catch (err) {
	  console.log(err);
	}

	let	avatars: string[] = [];
	
	try {
		const	directoryPath = "/app/transcendence-app/public/images/avatars";
		avatars = fs.readdirSync(directoryPath);

		avatars = avatars.map((avatar) => {
			if (avatar.includes("avatar"))
				return "/images/avatars/" + avatar;
			return avatar;
		});
	} catch (error) {
		console.log(error);
	}

	if (profile.provider === '42')
		avatars.unshift(profile.image);

	const	texts: string[] = [profile.email.slice(0, 2).toUpperCase()];

	return (
		<div>
			<FormLogin token={token as string} texts={texts} avatars={avatars} />
		</div>
	);
}
