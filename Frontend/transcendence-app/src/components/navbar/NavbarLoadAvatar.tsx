import { getAvatarByToken } from "@/lib/avatar/getAvatarByToken";
import { CryptoService } from "@/services/crypto/Crypto.service";
import avatarType from "@/types/Avatar.type";
import { cookies } from "next/dist/client/components/headers";
import NavbarHome from "./NavbarHome";

const	Crypto = new CryptoService();

export default async function NavbarLoadAvatar() {

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
