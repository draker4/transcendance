import NavbarHome from "./NavbarHome";
import { cookies } from "next/dist/client/components/headers";
import { getAvatarByToken } from "@/lib/avatar/getAvatarByToken";
import avatarType from "@/types/Avatar.type";
import { CryptoService } from "@/services/crypto/Crypto.service";
import { Suspense } from "react";
import NavbarLoadAvatar from "./NavbarLoadAvatar";

export default async function NavbarLogged() {

	let	avatar: avatarType = {
		image: "",
		variant: "",
		borderColor: "",
		text: "",
		empty: true,
	};

	return (
		<div>
			<Suspense fallback={<NavbarHome avatar={avatar}/>}>
				<NavbarLoadAvatar />
			</Suspense>
		</div>
	);
}
