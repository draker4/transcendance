import NavbarHome from "./NavbarHome";
import { cookies } from "next/dist/client/components/headers";
import { getAvatarByToken } from "@/lib/avatar/getAvatarByToken";
import avatarType from "@/types/Avatar.type";
import { CryptoService } from "@/services/crypto/Crypto.service";

const	Crypto = new CryptoService();

export default async function NavbarLogged() {

	let	token: string | undefined = "";
	let	avatar: avatarType = {
		image: "",
		variant: "",
		borderColor: "",
		backgroundColor: "",
		text: "",
		empty: true,
	};
	
	try {
		token = cookies().get("crunchy-token")?.value;
		if (!token)
			throw new Error("No token value");
		
		const	data = await getAvatarByToken(token);

		if (!data.error) {
			avatar = data;
			if (avatar.image && avatar.image.length > 0)
				avatar.image = await Crypto.decrypt(avatar.image);
		}
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
