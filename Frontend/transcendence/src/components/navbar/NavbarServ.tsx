import { cookies } from "next/dist/client/components/headers";
import { CryptoService } from "@/services/crypto/Crypto.service";
import Avatar_Service from "@/services/Avatar.service";

import NavbarFront from "./NavbarFront";
import Profile_Service from "@/services/Profile.service";

const Crypto = new CryptoService();

export default async function NavbarServ() {
  let avatar: avatarType = {
    image: "",
    name: "default",
    variant: "circular",
    borderColor: "#22d3e",
    backgroundColor: "#22d3ee",
    text: "dafault",
    empty: true,
    isChannel: false,
  };

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

  try {
    const token = cookies().get("crunchy-token")?.value;
    if (!token) throw new Error("No token value");

    const profileData = new Profile_Service(token);
    profile = await profileData.getProfileByToken();

    const Avatar = new Avatar_Service(token);

    avatar = await Avatar.getAvatarByName(profile.login);

    if (avatar.image.length > 0)
      avatar.image = await Crypto.decrypt(avatar.image);
  } catch (err) {
    // console.log(err);
  }

  return (
    <div>
      <NavbarFront avatar={avatar} profile={profile} />
    </div>
  );
}
