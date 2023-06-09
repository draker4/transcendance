import NavbarHome from "./NavbarHome";
import { cookies } from "next/dist/client/components/headers";
import { getAvatarByToken } from "@/lib/avatar/getAvatarByToken";
import avatarType from "@/types/Avatar.type";
import { CryptoService } from "@/services/crypto/Crypto.service";
import { NextRequest } from "next/server";

const	Crypto = new CryptoService();

export default async function NavbarLogged(req: NextRequest) {

	console.log(req);
	let	avatar: avatarType = {
		image: "",
		variant: "",
		borderColor: "",
		text: "",
		empty: false,
	};

	let	token: string | undefined = "";

	try {
		token = cookies().get("crunchy-token")?.value;
		if (!token)
			throw new Error("No token value");
	  
	  const	data = await getAvatarByToken(token);

	  if (!data.error) {
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
