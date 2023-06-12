import NavbarHome from "./NavbarHome";
import { cookies } from "next/dist/client/components/headers";
import { getAvatarByToken } from "@/lib/avatar/getAvatarByToken";
import avatarType from "@/types/Avatar.type";
import { CryptoService } from "@/services/crypto/Crypto.service";

const	Crypto = new CryptoService();

export default async function NavbarLogged() {

	console.log("here avatar logged");
	let	token: string | undefined = "";
	let	avatar: avatarType = {
		image: "",
		variant: "",
		borderColor: "",
		text: "",
		empty: true,
	};
	
	try {
		token = cookies().get("crunchy-token")?.value;
		if (!token)
			throw new Error("No token value");
		
		const	data = await getAvatarByToken(token);
		console.log("cookie=", token);
		console.log("avatar=", data);

		if (!data.error && data.image) {
			avatar = data;
		if (avatar.image.length > 0)
			avatar.image = await Crypto.decrypt(avatar.image);
		}
		else
			avatar.empty = true;
	}
	catch (err) {
	  console.log(err);
	}

	return (
		<div>
			<NavbarHome avatar={avatar}/>
		</div>
	);
}
